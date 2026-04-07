#!/usr/bin/env node
/**
 * PumaX402 **stellar-dex-signal** — señales DEX desde Horizon (sólo lectura), paywall x402 Exact.
 */
import express from "express";
import { paymentMiddlewareFromConfig } from "@x402/express";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

const payTo = process.env.DEX_X402_PAYTO?.trim();
if (!payTo) {
  console.error(
    "Falta DEX_X402_PAYTO (G… que recibe USDC). Ver apps/stellar-dex-signal/README.md",
  );
  process.exit(1);
}

const PRICE = process.env.DEX_X402_PRICE?.trim() || "$0.05";
const port = Number(process.env.PORT) || 3851;
const CACHE_TTL_MS = Math.max(
  5_000,
  Math.min(120_000, Number(process.env.DEX_CACHE_TTL_MS) || 45_000),
);

const isPubnet = process.env.STELLAR_NETWORK?.trim().toLowerCase() === "pubnet";
const network = isPubnet ? "stellar:pubnet" : "stellar:testnet";
const horizonBase = (
  process.env.STELLAR_HORIZON_URL?.trim() ||
  (isPubnet ? "https://horizon.stellar.org" : "https://horizon-testnet.stellar.org")
).replace(/\/$/, "");

const defaultBuyingIssuer =
  process.env.DEX_DEFAULT_BUYING_ISSUER?.trim() || "";

/** @type {Map<string, { t: number, v: unknown }>} */
const cache = new Map();

async function cached(key, fn) {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && now - hit.t < CACHE_TTL_MS) {
    return { ...hit.v, cacheHit: true };
  }
  const v = await fn();
  cache.set(key, { t: now, v });
  return { ...v, cacheHit: false };
}

const app = express();

const routes = {
  "GET /v1/signal": {
    accepts: {
      scheme: "exact",
      price: PRICE,
      network,
      payTo,
    },
    description:
      "Señal order book + trades recientes (Horizon) para un par; pensado para agentes / bots.",
  },
  "GET /v1/pools": {
    accepts: {
      scheme: "exact",
      price: PRICE,
      network,
      payTo,
    },
    description: "Snapshot corto de pools de liquidez recientes (Horizon AMM).",
  },
};

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
    service: "pumax402-stellar-dex-signal",
    network,
    horizon: horizonBase,
    price: PRICE,
    endpoints: {
      meta: { method: "GET", path: "/", payment: false },
      health: { method: "GET", path: "/health", payment: false },
      signal: {
        method: "GET",
        path: "/v1/signal",
        payment: true,
        query: {
          selling_type: "native | credit_alphanum4 | credit_alphanum12 (default native)",
          buying_type: "default credit_alphanum4",
          buying_code: "default USDC",
          buying_issuer: `default DEX_DEFAULT_BUYING_ISSUER env (${defaultBuyingIssuer ? "set" : "required for default pair"})`,
        },
      },
      pools: { method: "GET", path: "/v1/pools", payment: true, query: { limit: "1-50 default 10" } },
    },
    caveats: [
      "Datos de Horizon público; no es asesoramiento financiero.",
      `Caché ~${CACHE_TTL_MS} ms por clave para respetar rate limits.`,
    ],
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "pumax402-stellar-dex-signal", network });
});

/**
 * @param {{ type: string, code?: string, issuer?: string }} selling
 * @param {{ type: string, code?: string, issuer?: string }} buying
 */
function orderBookQs(selling, buying) {
  const p = new URLSearchParams();
  p.set("selling_asset_type", selling.type);
  if (selling.type !== "native") {
    p.set("selling_asset_code", selling.code || "");
    p.set("selling_asset_issuer", selling.issuer || "");
  }
  p.set("buying_asset_type", buying.type);
  if (buying.type !== "native") {
    p.set("buying_asset_code", buying.code || "");
    p.set("buying_asset_issuer", buying.issuer || "");
  }
  return p;
}

function tradesQs(base, counter) {
  const p = new URLSearchParams();
  p.set("order", "desc");
  p.set("limit", "20");
  p.set("base_asset_type", base.type);
  if (base.type !== "native") {
    p.set("base_asset_code", base.code || "");
    p.set("base_asset_issuer", base.issuer || "");
  }
  p.set("counter_asset_type", counter.type);
  if (counter.type !== "native") {
    p.set("counter_asset_code", counter.code || "");
    p.set("counter_asset_issuer", counter.issuer || "");
  }
  return p;
}

function parseAssetPair(req) {
  const sellingType = (req.query.selling_type || "native").trim();
  const buyingType = (req.query.buying_type || "credit_alphanum4").trim();
  const buyingCode = (req.query.buying_code || "USDC").trim();
  const buyingIssuer = (req.query.buying_issuer || defaultBuyingIssuer).trim();
  const sellingCode = (req.query.selling_code || "").trim();
  const sellingIssuer = (req.query.selling_issuer || "").trim();

  /** @type {{ type: string, code?: string, issuer?: string }} */
  const selling = { type: sellingType };
  if (sellingType !== "native") {
    selling.code = sellingCode;
    selling.issuer = sellingIssuer;
    if (!selling.code || !selling.issuer) {
      throw new Error("Para selling no-native, requiere selling_code y selling_issuer");
    }
  }
  /** @type {{ type: string, code?: string, issuer?: string }} */
  const buying = { type: buyingType };
  if (buyingType !== "native") {
    buying.code = buyingCode;
    buying.issuer = buyingIssuer;
    if (!buying.issuer) {
      throw new Error(
        "buying_issuer requerido (o define DEX_DEFAULT_BUYING_ISSUER para USDC por defecto)",
      );
    }
  }
  return { selling, buying };
}

function summarizeBook(bids, asks) {
  const bestBid = bids?.[0]?.price ? Number(bids[0].price) : null;
  const bestAsk = asks?.[0]?.price ? Number(asks[0].price) : null;
  let spreadPct = null;
  let mid = null;
  if (bestBid != null && bestAsk != null && bestBid > 0) {
    mid = (bestBid + bestAsk) / 2;
    spreadPct = ((bestAsk - bestBid) / mid) * 100;
  }
  return {
    levelsBid: bids?.length ?? 0,
    levelsAsk: asks?.length ?? 0,
    bestBid,
    bestAsk,
    mid,
    spreadPct,
    topBidAmount: bids?.[0]?.amount ?? null,
    topAskAmount: asks?.[0]?.amount ?? null,
  };
}

app.get("/v1/signal", async (req, res) => {
  try {
    const { selling, buying } = parseAssetPair(req);
    const obQ = orderBookQs(selling, buying).toString();
    const cacheKey = `signal:${obQ}`;

    const payload = await cached(cacheKey, async () => {
      const obUrl = `${horizonBase}/order_book?${obQ}`;
      const r = await fetch(obUrl);
      if (!r.ok) {
        throw new Error(`Horizon order_book HTTP ${r.status}`);
      }
      const book = await r.json();
      const bids = book.bids || [];
      const asks = book.asks || [];

      const tQ = tradesQs(selling, buying).toString();
      const trUrl = `${horizonBase}/trades?${tQ}`;
      const tr = await fetch(trUrl);
      let recentTradeCount = 0;
      let lastTradePrice = null;
      if (tr.ok) {
        const tj = await tr.json();
        const recs = tj._embedded?.records || [];
        recentTradeCount = recs.length;
        if (recs[0]?.price?.d && recs[0]?.price?.n) {
          lastTradePrice = Number(recs[0].price.n) / Number(recs[0].price.d);
        } else if (recs[0]?.price) {
          lastTradePrice = Number(recs[0].price);
        }
      }

      return {
        schemaVersion: 1,
        product: "pumax402-stellar-dex-signal",
        network,
        horizon: horizonBase,
        pair: {
          selling,
          buying,
        },
        orderBook: summarizeBook(bids, asks),
        recentTrades: {
          sampleSize: recentTradeCount,
          lastTradePrice,
        },
        generatedAt: new Date().toISOString(),
      };
    });

    res.json(payload);
  } catch (e) {
    console.error(e);
    const status = e instanceof Error && e.message.includes("requiere") ? 400 : 502;
    res.status(status).json({
      error: status === 400 ? "bad_request" : "upstream",
      message: e instanceof Error ? e.message : String(e),
    });
  }
});

app.get("/v1/pools", async (req, res) => {
  try {
    const lim = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const cacheKey = `pools:${lim}`;

    const payload = await cached(cacheKey, async () => {
      const url = `${horizonBase}/liquidity_pools?limit=${lim}&order=desc`;
      const r = await fetch(url);
      if (!r.ok) {
        throw new Error(`Horizon liquidity_pools HTTP ${r.status}`);
      }
      const j = await r.json();
      const records = j._embedded?.records || [];
      return {
        schemaVersion: 1,
        product: "pumax402-stellar-dex-signal",
        network,
        horizon: horizonBase,
        poolCountReturned: records.length,
        pools: records.map((p) => ({
          id: p.id,
          type: p.type,
          totalShares: p.total_shares,
          totalTrustlines: p.total_trustlines,
          reserves: (p.reserves || []).map((x) => ({
            asset: x.asset,
            amount: x.amount,
          })),
          lastModified: p.last_modified_time,
        })),
        generatedAt: new Date().toISOString(),
      };
    });

    res.json(payload);
  } catch (e) {
    console.error(e);
    res.status(502).json({
      error: "upstream",
      message: e instanceof Error ? e.message : String(e),
    });
  }
});

app.listen(port, () => {
  console.error(`stellar-dex-signal  http://127.0.0.1:${port}/`);
  console.error(`  GET /v1/signal /v1/pools (x402)  ${PRICE}  ${network}`);
});
