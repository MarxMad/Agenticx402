#!/usr/bin/env node
/**
 * Genera N llamadas pagadas al servicio energy-signal usando el mismo flujo x402 que el CLI.
 *
 * Env: STELLAR_SECRET_KEY (obligatoria), ENERGY_SIGNAL_URL (default http://localhost:3853), STELLAR_NETWORK=testnet|pubnet
 * Uso: node scripts/generate-volume.mjs [CALLS=20] [DELAY_MS=1500]
 */
import {
  createPaywallHttpClient,
  paywallFetch,
} from "../apps/cli/lib/x402-fetch.mjs";

const secret = process.env.STELLAR_SECRET_KEY?.trim();
if (!secret) {
  console.error("Falta STELLAR_SECRET_KEY (S... testnet/pubnet).");
  process.exit(1);
}

const baseUrl = (
  process.env.ENERGY_SIGNAL_URL?.trim() || "http://localhost:3853"
).replace(/\/$/, "");
const isPubnet = process.env.STELLAR_NETWORK?.trim().toLowerCase() === "pubnet";
const network = isPubnet ? "pubnet" : "testnet";

const CALLS = Math.max(1, Number(process.argv[2]) || 20);
const DELAY_MS = Math.max(0, Number(process.argv[3]) || 1500);

const ASSETS = ["WTI", "BRENT", "WTI"];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("  PumaX402 volume — energy-signal");
  console.error(`  Endpoint: ${baseUrl}/v1/signal`);
  console.error(`  Red: stellar ${network}`);
  console.error(`  Llamadas: ${CALLS}  ·  Delay: ${DELAY_MS}ms`);
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const httpClient = createPaywallHttpClient(secret, { network });

  let ok = 0;
  let fail = 0;
  let totalPaid = 0;
  const signalCounts = { BUY: 0, SELL: 0, HOLD: 0 };

  for (let i = 0; i < CALLS; i++) {
    const asset = ASSETS[i % 3];
    const url = `${baseUrl}/v1/signal?asset=${encodeURIComponent(asset)}`;
    const n = i + 1;

    try {
      const res = await paywallFetch(
        url,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        },
        { httpClient },
      );

      const text = await res.text();
      if (res.status === 200) {
        ok += 1;
        totalPaid += 0.1;
        let body;
        try {
          body = text ? JSON.parse(text) : {};
        } catch {
          body = {};
        }
        const sig = String(body.signal || "?").toUpperCase();
        if (signalCounts[sig] !== undefined) signalCounts[sig] += 1;
        const price = body.price_usd ?? "?";
        const risk = body.risk_level ?? "?";
        console.log(
          `[${n}/${CALLS}] ✓  ${asset}  $${price}  ${sig}  ${risk}`,
        );
      } else {
        fail += 1;
        console.log(
          `[${n}/${CALLS}] ✗  HTTP ${res.status}  ${text.slice(0, 120)}`,
        );
      }
    } catch (e) {
      fail += 1;
      console.log(
        `[${n}/${CALLS}] ✗  ${e instanceof Error ? e.message : String(e)}`,
      );
    }

    if (i < CALLS - 1 && DELAY_MS > 0) {
      await sleep(DELAY_MS);
    }
  }

  const explorer = isPubnet
    ? "https://stellar.expert/explorer/public"
    : "https://stellar.expert/explorer/testnet";

  console.error("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("  Resumen");
  console.error(`  Exitosas: ${ok}  ·  Fallidas: ${fail}`);
  console.error(`  Revenue aprox. (cliente): ${totalPaid.toFixed(2)} USDC`);
  console.error(
    `  Señales: BUY=${signalCounts.BUY}  SELL=${signalCounts.SELL}  HOLD=${signalCounts.HOLD}`,
  );
  console.error(`  Explorador (${network}): ${explorer}`);
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
