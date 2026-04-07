#!/usr/bin/env node
/**
 * PumaX402 **geopolitical-risk** — orquestador: compra noticias xlm402 (~$0.01) y vende agregación de riesgo (~$0.08).
 */
import express from "express";
import { paymentMiddlewareFromConfig } from "@x402/express";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import {
  createPaywallHttpClient,
  paywallFetch,
} from "../cli/lib/x402-fetch.mjs";
import { checkTrustline } from "../shared/trustline.mjs";

const payTo = process.env.GEO_X402_PAYTO?.trim();
if (!payTo) {
  console.error(
    "Falta GEO_X402_PAYTO (G… que recibe USDC). Ver apps/geopolitical-risk/README.md",
  );
  process.exit(1);
}

const upstreamSecret = process.env.GEO_UPSTREAM_SECRET_KEY?.trim();
if (!upstreamSecret) {
  console.error(
    "Falta GEO_UPSTREAM_SECRET_KEY (S… cuenta caliente testnet con USDC para pagar xlm402.com). Ver README.",
  );
  process.exit(1);
}

const PRICE = process.env.GEO_X402_PRICE?.trim() || "$0.08";
const port = Number(process.env.PORT) || 3852;
const isPubnet = process.env.STELLAR_NETWORK?.trim().toLowerCase() === "pubnet";
const network = isPubnet ? "stellar:pubnet" : "stellar:testnet";
const xlm402Host = (
  process.env.XLM402_HOST?.trim() || "https://xlm402.com"
).replace(/\/$/, "");
/** testnet | mainnet path prefix for xlm402 news */
const newsPrefix = isPubnet ? "/news" : "/testnet/news";

const REGION_TO_CATEGORY = {
  global: "global",
  americas: "business",
  europe: "economics",
  "middle-east": "politics",
  "asia-pacific": "economics",
  africa: "global",
  politics: "politics",
  economics: "economics",
  security: "security",
};

const HIGH = /\b(war|invasion|sanctions|missile|terror|coup|armed conflict|genocide)\b/i;
const ELEVATED = /\b(crisis|recession|protest|unrest|blockade|default|embargo|election dispute|oil shock)\b/i;

const app = express();

const routes = {
  "GET /v1/risk": {
    accepts: {
      scheme: "exact",
      price: PRICE,
      network,
      payTo,
    },
    description:
      "Agregación heurística de riesgo geopolítico a partir de news xlm402 (upstream pagado).",
  },
};

app.use(checkTrustline);

app.use(
  paymentMiddlewareFromConfig(
    routes,
    [new HTTPFacilitatorClient()],
    [{ network, server: new ExactStellarScheme() }],
    undefined,
    undefined,
    true,
  ),
);

app.get("/", (_req, res) => {
  res.type("application/json");
  res.json({
    service: "pumax402-geopolitical-risk",
    network,
    priceClient: PRICE,
    upstream: {
      host: xlm402Host,
      newsPathPattern: `${newsPrefix}/{category}`,
      approximateUpstreamPerRequestUSD: 0.01,
    },
    endpoints: {
      meta: { method: "GET", path: "/", payment: false },
      health: { method: "GET", path: "/health", payment: false },
      risk: {
        method: "GET",
        path: "/v1/risk",
        payment: true,
        query: {
          region:
            "global | americas | europe | middle-east | africa | asia-pacific | politics | economics | security (default global)",
        },
      },
    },
    disclaimer:
      "Señal agregada propia; no asesoramiento. Revisa términos de xlm402.com. No republicamos cuerpos completos de noticias.",
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "pumax402-geopolitical-risk", network });
});

/**
 * @param {unknown} data
 * @returns {unknown[]}
 */
function extractStories(data) {
  if (!data || typeof data !== "object") return [];
  const o = data;
  if (Array.isArray(o.stories)) return o.stories;
  if (Array.isArray(o.items)) return o.items;
  if (Array.isArray(o.results)) return o.results;
  if (Array.isArray(o)) return o;
  if (Array.isArray(o.data?.stories)) return o.data.stories;
  return [];
}

/**
 * @param {unknown} s
 */
function storyTexts(s) {
  if (!s || typeof s !== "object") return "";
  const o = s;
  const parts = [
    o.title,
    o.headline,
    o.summary,
    o.description,
    o.snippet,
  ].filter((x) => typeof x === "string");
  return parts.join(" • ").toLowerCase();
}

/**
 * @param {string[]} texts
 * @param {string} regionSlug
 */
function scoreRisk(texts, regionSlug) {
  let high = 0;
  let elevated = 0;
  for (const t of texts) {
    if (!t) continue;
    if (HIGH.test(t)) high += 1;
    else if (ELEVATED.test(t)) elevated += 1;
  }
  let riskBand = "low";
  if (high >= 1) riskBand = "high";
  else if (elevated >= 1) riskBand = "elevated";

  return {
    riskBand,
    keywordHits: { high, elevated },
    regionFocus: regionSlug,
    methodology: "heuristic_keyword_v1",
  };
}

app.get("/v1/risk", async (req, res) => {
  const regionRaw = (req.query.region || "global").toString().toLowerCase().trim();
  const category =
    REGION_TO_CATEGORY[regionRaw] || REGION_TO_CATEGORY.global;

  const newsUrl = `${xlm402Host}${newsPrefix}/${category}?limit=12&max_per_feed=6`;

  try {
    const net = isPubnet ? "pubnet" : "testnet";
    const httpClient = createPaywallHttpClient(upstreamSecret, { network: net });

    const upstreamRes = await paywallFetch(
      newsUrl,
      {
        method: "GET",
        headers: {
          Accept: "application/json, */*;q=0.8",
        },
      },
      { httpClient },
    );

    const text = await upstreamRes.text();
    let parsed;
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = { raw: text.slice(0, 500) };
    }

    const stories = extractStories(parsed);
    const texts = stories.map((s) => storyTexts(s)).filter(Boolean);
    const titlesSample = stories
      .slice(0, 8)
      .map((s) => {
        if (!s || typeof s !== "object") return null;
        const o = s;
        const title =
          typeof o.title === "string"
            ? o.title
            : typeof o.headline === "string"
              ? o.headline
              : null;
        return title ? title.slice(0, 160) : null;
      })
      .filter(Boolean);

    const aggregation = scoreRisk(texts, regionRaw);

    res.json({
      schemaVersion: 1,
      product: "pumax402-geopolitical-risk",
      network,
      query: { region: regionRaw, newsCategory: category },
      aggregation: {
        ...aggregation,
        headlineSamples: titlesSample,
        storiesParsed: stories.length,
      },
      sourcesUsed: [
        {
          vendor: "xlm402.com",
          kind: "news",
          urlRedacted: `${xlm402Host}${newsPrefix}/{category}`,
          category,
          approximatePaidUSDPerUpstreamCall: 0.01,
        },
      ],
      upstreamHttpStatus: upstreamRes.status,
      generatedAt: new Date().toISOString(),
      disclaimer:
        "Agregación operacional para agentes; no sustituye análisis humano ni compliance. Datos derivados de titulares/resúmenes.",
    });
  } catch (e) {
    console.error(e);
    res.status(502).json({
      error: "upstream_or_settlement",
      message: e instanceof Error ? e.message : String(e),
    });
  }
});

app.listen(port, () => {
  console.error(`geopolitical-risk  http://127.0.0.1:${port}/`);
  console.error(`  GET /v1/risk (x402)  ${PRICE}  ${network}`);
  console.error("  GEO_UPSTREAM_SECRET_KEY: loaded (no se imprimen secretos)");
});
