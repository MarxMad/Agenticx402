#!/usr/bin/env node
import { parseArgs } from "node:util";
import { loadCatalog, findService, resolveServiceUrl } from "../lib/catalog-load.mjs";
import { createPaywallHttpClient, paywallFetch } from "../lib/x402-fetch.mjs";

function printHelp() {
  console.log(`agenticx402 — CLI Fase 2 (x402 + Stellar)

Uso:
  agenticx402 list
      Lista servicios del catálogo (archivo o AGENTICX402_CATALOG_URL).

  agenticx402 fetch <url> [--method GET]
      GET/POST… a una URL; si responde 402, firma con tu cuenta y reintenta.

  agenticx402 call <service-id> --path <ruta> [--method GET]
      Igual que fetch pero arma la URL con baseUrl del catálogo + --path.

Variables de entorno:
  STELLAR_SECRET_KEY     Clave secreta S... (obligatoria para 402)
  STELLAR_NETWORK        testnet | pubnet (default: testnet)
  STELLAR_SOROBAN_RPC_URL  Opcional; RPC Soroban personalizado
  AGENTICX402_CATALOG_URL  Opcional; p. ej. http://127.0.0.1:3840/services
  AGENTICX402_CATALOG_FILE Ruta absoluta a services.json si no usas URL

Ejemplos:
  npm run cli -- list
  npm run cli -- fetch "https://…" --method GET
  npm run cli -- call stellar-observatory --path /api/foo --method GET
`);
}

async function cmdList() {
  const catalog = await loadCatalog();
  const net = catalog.networkDefault || "—";
  console.log(`Catálogo v${catalog.version} · red por defecto: ${net}\n`);
  for (const s of catalog.services || []) {
    console.log(`  ${s.id}`);
    console.log(`    ${s.name}`);
    console.log(`    ${s.baseUrl}`);
    console.log(`    tags: ${(s.tags || []).join(", ")} · status: ${s.status}`);
    console.log("");
  }
}

async function cmdFetch(positionals, values) {
  const url = positionals[0];
  if (!url) {
    console.error("Falta <url>.");
    process.exit(1);
  }
  const method = (values.method || "GET").toUpperCase();
  const init = {
    method,
    headers: { Accept: "application/json, text/plain;q=0.9,*/*;q=0.8" },
  };
  const secret = process.env.STELLAR_SECRET_KEY?.trim();

  let res;
  if (secret) {
    const network = process.env.STELLAR_NETWORK === "pubnet" ? "pubnet" : "testnet";
    const httpClient = createPaywallHttpClient(secret, { network });
    res = await paywallFetch(url, init, { httpClient });
  } else {
    res = await fetch(url, init);
    if (res.status === 402) {
      console.error(
        "402 Payment Required — exporta STELLAR_SECRET_KEY (testnet) y vuelve a ejecutar para firmar el pago."
      );
      process.exit(1);
    }
  }

  const text = await res.text();
  console.error(`HTTP ${res.status} ${res.statusText}`);
  try {
    const j = JSON.parse(text);
    console.log(JSON.stringify(j, null, 2));
  } catch {
    console.log(text);
  }
  if (!res.ok) process.exit(1);
}

async function cmdCall(positionals, values) {
  const id = positionals[0];
  const p = values.path;
  if (!id || !p) {
    console.error("Uso: agenticx402 call <service-id> --path /ruta");
    process.exit(1);
  }
  const catalog = await loadCatalog();
  const service = findService(catalog, id);
  const url = resolveServiceUrl(service, p);
  await cmdFetch([url], values);
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      method: { type: "string", short: "X", default: "GET" },
      path: { type: "string", short: "p" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help || positionals.length === 0) {
    printHelp();
    process.exit(positionals.length === 0 ? 0 : 0);
  }

  const cmd = positionals[0];
  const rest = positionals.slice(1);

  try {
    if (cmd === "list") {
      await cmdList();
    } else if (cmd === "fetch") {
      await cmdFetch(rest, values);
    } else if (cmd === "call") {
      await cmdCall(rest, values);
    } else {
      console.error(`Comando desconocido: ${cmd}`);
      printHelp();
      process.exit(1);
    }
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  }
}

main();
