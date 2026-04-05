#!/usr/bin/env node
/**
 * PumaX402 **Agent Pulse** — API x402 (Exact, Stellar testnet) que devuelve
 * contexto de red empaquetado para prompts de agentes (ledger, fees, hints).
 */
import express from "express";
import { paymentMiddlewareFromConfig } from "@x402/express";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

const payTo = process.env.PUMA_X402_PAYTO?.trim();
if (!payTo) {
  console.error(
    "Falta PUMA_X402_PAYTO (cuenta G… que recibe USDC testnet; trustline USDC). Ver apps/puma-service/README.md"
  );
  process.exit(1);
}

const PRICE = process.env.PUMA_X402_PRICE?.trim() || "$0.001";
const port = Number(process.env.PORT) || 3850;
const horizonBase =
  process.env.STELLAR_HORIZON_URL?.trim() || "https://horizon-testnet.stellar.org";

const app = express();

const routes = {
  "GET /v1/pulse": {
    accepts: {
      scheme: "exact",
      price: PRICE,
      network: "stellar:testnet",
      payTo,
    },
    description:
      "Pulse testnet Stellar: ledger reciente + hints para prompts de agentes (PumaX402).",
  },
};

app.use(
  paymentMiddlewareFromConfig(
    routes,
    [new HTTPFacilitatorClient()],
    [{ network: "stellar:testnet", server: new ExactStellarScheme() }],
    undefined,
    undefined,
    true
  )
);

app.get("/", (_req, res) => {
  res.type("application/json");
  res.json({
    service: "pumax402-agent-pulse",
    tagline:
      "Contexto Stellar testnet empaquetado para LLMs: paga vía x402 y obtén JSON estable para system prompts.",
    innovation:
      "No es un catálogo ni otro endpoint genérico: un solo contrato mental — 'pulse' de cadena para que el agente no alucine red/ledger.",
    endpoints: {
      meta: { method: "GET", path: "/", payment: false },
      health: { method: "GET", path: "/health", payment: false },
      pulse: {
        method: "GET",
        path: "/v1/pulse",
        payment: "x402 Exact (USDC testnet)",
        price: PRICE,
      },
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "pumax402-agent-pulse" });
});

app.get("/v1/pulse", async (_req, res) => {
  try {
    res.json(await buildPulsePayload(horizonBase));
  } catch (e) {
    console.error(e);
    res.status(502).json({
      error: "upstream",
      message: e instanceof Error ? e.message : String(e),
    });
  }
});

async function buildPulsePayload(horizon) {
  const r = await fetch(`${horizon}/ledgers?order=desc&limit=1`);
  if (!r.ok) {
    throw new Error(`Horizon HTTP ${r.status}`);
  }
  const j = await r.json();
  const rec = j._embedded?.records?.[0];
  if (!rec) {
    throw new Error("Horizon: sin ledgers en la respuesta");
  }
  return {
    schemaVersion: 1,
    product: "pumax402-agent-pulse",
    network: "stellar:testnet",
    horizon,
    latestClosedLedger: rec.sequence,
    closedAt: rec.closed_at,
    protocolVersion: rec.protocol_version,
    baseFeeInStroops: rec.base_fee_in_stroops,
    baseReserveInStroops: rec.base_reserve_in_stroops,
    hintForAgentPrompts: [
      "Red: Stellar **testnet** — no usar direcciones ni activos de mainnet en esta respuesta.",
      `Último ledger cerrado: **${rec.sequence}** (${rec.closed_at}).`,
      `Fee base por operación (referencia): **${rec.base_fee_in_stroops}** stroops.`,
      "Para x402 en testnet usar USDC Soroban y facilitator compatible; nunca incluir claves secretas (S...) en prompts ni logs públicos.",
    ],
    generatedAt: new Date().toISOString(),
  };
}

app.listen(port, () => {
  console.error(`PumaX402 Agent Pulse  http://127.0.0.1:${port}/`);
  console.error(`  GET /v1/pulse (x402)  ${PRICE}  →  ${payTo.slice(0, 10)}…`);
});
