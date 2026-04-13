#!/usr/bin/env node
/**
 * PumaX402 **energy-signal** — precios simulados WTI/Brent/GAS + señal (Groq opcional o heurística local), paywall x402 Exact Stellar.
 *
 * Env: ENERGY_X402_PAYTO (G..., obligatoria), ENERGY_X402_PRICE (default $0.10), GROQ_API_KEY (opcional),
 *      STELLAR_NETWORK=testnet|pubnet (default testnet), PORT (default 3853).
 * Arranque: ENERGY_X402_PAYTO=G... npm run energy-signal
 */

import express from "express";
import { paymentMiddlewareFromConfig } from "@x402/express";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

const payTo = process.env.ENERGY_X402_PAYTO?.trim();
if (!payTo) {
  console.error(
    "Falta ENERGY_X402_PAYTO (cuenta G… que recibe USDC). Ver apps/energy-signal (README implícito en repo).",
  );
  process.exit(1);
}

const PRICE = process.env.ENERGY_X402_PRICE?.trim() || "$0.10";
const port = Number(process.env.PORT) || 3853;
const isPubnet = process.env.STELLAR_NETWORK?.trim().toLowerCase() === "pubnet";
const network = isPubnet ? "stellar:pubnet" : "stellar:testnet";

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
      "Señal energética WTI/Brent/GAS (precio simulado) + análisis IA opcional vía Groq.",
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
    service: "pumax402-energy-signal",
    tagline:
      "Precio petróleo simulado (contexto crisis 2026) + señal BUY/SELL/HOLD e impacto LATAM; pago x402.",
    endpoints: {
      meta: { method: "GET", path: "/", payment: false },
      health: { method: "GET", path: "/health", payment: false },
      signal: {
        method: "GET",
        path: "/v1/signal",
        query: "asset=WTI|BRENT|GAS (default WTI)",
        payment: "x402 Exact (USDC)",
        price: PRICE,
      },
    },
    network,
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "pumax402-energy-signal", network });
});

/**
 * @param {string} raw
 */
function normalizeAsset(raw) {
  const a = (raw || "WTI").toString().toUpperCase().trim();
  if (a === "WTI" || a === "BRENT" || a === "GAS") return a;
  return "WTI";
}

/**
 * Precios base simulados (sin APIs externas con key).
 * @param {string} asset WTI|BRENT|GAS
 */
function getOilPrice(asset) {
  let base;
  let spread;
  if (asset === "BRENT") {
    base = 121.5;
    spread = 3;
  } else if (asset === "GAS") {
    base = 3.42;
    spread = 0.15;
  } else {
    base = 118.8;
    spread = 3;
  }
  const noise = (Math.random() - 0.5) * 2 * spread;
  const raw = base + noise;
  return Math.round(raw * 100) / 100;
}

/**
 * @param {number} price
 * @param {string} asset
 */
function localAnalyze(price, asset) {
  let signal = "HOLD";
  if (price > 122) signal = "SELL";
  else if (price < 116) signal = "BUY";
  let risk_level = "LOW";
  if (price > 125) risk_level = "CRITICAL";
  else if (price > 120) risk_level = "HIGH";
  else if (price > 115) risk_level = "MEDIUM";
  return {
    signal,
    reasoning: `Heuristic ${asset}: Ormuz stress Iran 2026; price ${price}.`,
    impact_latam: "FX pressure MXN COP BRL vs USD",
    risk_level,
  };
}

/**
 * @param {string} text
 */
function parseGroqJson(text) {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fence ? fence[1].trim() : trimmed;
  try {
    return JSON.parse(candidate);
  } catch {
    try {
      const start = candidate.indexOf("{");
      const end = candidate.lastIndexOf("}");
      if (start >= 0 && end > start) {
        return JSON.parse(candidate.slice(start, end + 1));
      }
    } catch {
      return null;
    }
    return null;
  }
}

/**
 * @param {unknown} o
 * @param {number} price
 * @param {string} asset
 */
function coerceGroqShape(o, price, asset) {
  if (!o || typeof o !== "object") return localAnalyze(price, asset);
  const x = o;
  const sig = ["BUY", "SELL", "HOLD"].includes(String(x.signal).toUpperCase())
    ? String(x.signal).toUpperCase()
    : localAnalyze(price, asset).signal;
  const risk = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(
    String(x.risk_level).toUpperCase(),
  )
    ? String(x.risk_level).toUpperCase()
    : localAnalyze(price, asset).risk_level;
  return {
    signal: sig,
    reasoning:
      typeof x.reasoning === "string" && x.reasoning.length > 0
        ? x.reasoning.slice(0, 200)
        : localAnalyze(price, asset).reasoning,
    impact_latam:
      typeof x.impact_latam === "string" && x.impact_latam.length > 0
        ? x.impact_latam.slice(0, 120)
        : localAnalyze(price, asset).impact_latam,
    risk_level: risk,
  };
}

/**
 * @param {number} price
 * @param {string} asset
 */
async function analyzeWithGroq(price, asset) {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) {
    return localAnalyze(price, asset);
  }
  try {
    const system =
      "Respond only with a single JSON object, no markdown. Fields: signal (BUY|SELL|HOLD), reasoning (max 12 words), impact_latam (max 8 words on MXN/COP/BRL), risk_level (LOW|MEDIUM|HIGH|CRITICAL).";
    const user = `Context: US-Israel-Iran 2026 tensions, Strait of Hormuz constrained, IEA released 400M barrels reserve. Asset ${asset}, simulated price USD ${price}. Return JSON only.`;

    let res;
    try {
      res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 200,
          temperature: 0.2,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
    } catch (e) {
      console.error("Groq fetch failed:", e);
      return localAnalyze(price, asset);
    }

    if (!res.ok) {
      console.error(`Groq HTTP ${res.status}`);
      return localAnalyze(price, asset);
    }

    let j;
    try {
      j = await res.json();
    } catch (e) {
      console.error("Groq JSON parse:", e);
      return localAnalyze(price, asset);
    }

    const text = j?.choices?.[0]?.message?.content;
    const parsed = parseGroqJson(typeof text === "string" ? text : "");
    return coerceGroqShape(parsed, price, asset);
  } catch (e) {
    console.error(e);
    return localAnalyze(price, asset);
  }
}

app.get("/v1/signal", async (req, res) => {
  try {
    const asset = normalizeAsset(req.query.asset);
    const price_usd = getOilPrice(asset);
    const analysis = await analyzeWithGroq(price_usd, asset);

    res.json({
      timestamp: new Date().toISOString(),
      service: "pumax402-energy-signal",
      asset,
      price_usd,
      signal: analysis.signal,
      reasoning: analysis.reasoning,
      impact_latam: analysis.impact_latam,
      risk_level: analysis.risk_level,
      network,
      paid_via: "x402/stellar",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "internal",
      message: e instanceof Error ? e.message : String(e),
    });
  }
});

app.listen(port, () => {
  const groqState = process.env.GROQ_API_KEY?.trim()
    ? "Groq configurado"
    : "sin GROQ_API_KEY — lógica local";
  console.error(`pumax402-energy-signal  http://127.0.0.1:${port}/`);
  console.error(
    `  GET /v1/signal (x402)  ${PRICE}  →  ${payTo.slice(0, 10)}…  |  ${groqState}`,
  );
});
