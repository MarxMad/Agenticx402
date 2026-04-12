#!/usr/bin/env node
import { parseArgs } from "node:util";
import { loadCatalog, findService, resolveServiceUrl } from "../lib/catalog-load.mjs";
import { createPaywallHttpClient, paywallFetch } from "../lib/x402-fetch.mjs";
import { printBannerFull, printBannerMini } from "../lib/banner.mjs";
import { runSplash } from "../lib/splash-chrome.mjs";

/**
 * Clave secreta Stellar estándar (strkey): S + 55 caracteres = 56 en total.
 * @param {string} secret
 */
function looksLikeStellarSecret(secret) {
  return (
    typeof secret === "string" &&
    secret.startsWith("S") &&
    secret.length === 56
  );
}

/**
 * @param {unknown} err
 * @returns {boolean} true si ya se imprimió ayuda
 */
function explainStellarSecretError(err) {
  const m = err instanceof Error ? err.message : String(err);
  if (!/invalid encoded|strkey|decode|secret key/i.test(m)) {
    return false;
  }
  console.error("STELLAR_SECRET_KEY no es decodificable como clave Stellar.");
  console.error("  • Debe ser la clave del **pagador** (empieza por S, 56 caracteres), no la pública G...");
  console.error("  • No uses la misma G que ENERGY_X402_PAYTO / PUMA_X402_PAYTO en el CLI.");
  console.error("  • Revisa export / .env: sin comillas dentro del valor ni saltos de línea.");
  return true;
}

function printHelp() {
  printBannerFull();
  console.log(`Uso:
  agenticx402 splash [--animate]
      Pantalla de bienvenida (cartel PUMAX402 + comandos). Sin cambiar el fondo del terminal.
      --animate (TTY, con color): el cartel pixel se anima unos segundos (onda azul/blanco) y un indicador «listo».

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
  AGENTICX402_NO_BANNER   1 = sin arte ASCII al inicio (útil en CI / logs)

Ejemplos:
  npm run cli -- splash
  npm run cli -- splash --animate
  npm run cli -- list
  npm run cli -- fetch "https://…" --method GET
  npm run cli -- call stellar-observatory --path /api/foo --method GET
`);
}

async function cmdSplash(values) {
  await runSplash({ animate: Boolean(values.animate) });
}

async function cmdList() {
  printBannerMini();
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
    if (!looksLikeStellarSecret(secret)) {
      console.error(
        `STELLAR_SECRET_KEY inválida (longitud ${secret.length}, debe ser S + 55 chars = 56). ¿Pegaste G... en lugar de S...?`,
      );
      process.exit(1);
    }
    const network = process.env.STELLAR_NETWORK === "pubnet" ? "pubnet" : "testnet";
    try {
      const httpClient = createPaywallHttpClient(secret, { network });
      res = await paywallFetch(url, init, { httpClient });
    } catch (e) {
      if (explainStellarSecretError(e)) {
        process.exit(1);
      }
      throw e;
    }
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
      animate: { type: "boolean", short: "a", default: false },
    },
  });

  if (values.help || positionals.length === 0) {
    printHelp();
    process.exit(positionals.length === 0 ? 0 : 0);
  }

  const cmd = positionals[0];
  const rest = positionals.slice(1);

  try {
    if (cmd === "splash") {
      await cmdSplash(values);
    } else if (cmd === "list") {
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
