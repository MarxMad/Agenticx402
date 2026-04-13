#!/usr/bin/env node
/**
 * Comprobaciones reproducibles para cerrar Fase 0 (sin imprimir secretos).
 * - Catálogo válido
 * - CLI lista servicios
 * - Opcional: si existen STELLAR_SECRET_KEY y X402_SMOKE_URL, un fetch con pago 402
 *
 * Uso: npm run fase0:check
 *
 * Carga el mismo .env que el CLI (raíz del repo) para que STELLAR_SECRET_KEY
 * no tenga que estar exportada en la shell.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadRepoEnv } from "../apps/lib/load-repo-env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

loadRepoEnv();

function runNode(relScript, args, extraEnv = {}) {
  const scriptPath = path.join(root, relScript);
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: root,
    env: { ...process.env, AGENTICX402_NO_BANNER: "1", NO_COLOR: "1", ...extraEnv },
    encoding: "utf8",
  });
}

let failed = false;
function ok(msg) {
  console.log(`  ✓ ${msg}`);
}
function fail(msg) {
  console.error(`  ✗ ${msg}`);
  failed = true;
}

console.log("PumaX402 — Fase 0 check (repo)\n");

const major = Number(process.versions.node.split(".")[0]);
if (major < 20) {
  fail(`Node >= 20 requerido (tienes ${process.version})`);
} else {
  ok(`Node ${process.version}`);
}

const v = runNode("scripts/validate-catalog.mjs", []);
if (v.status === 0) {
  ok("catalog:validate");
} else {
  fail("catalog:validate");
  if (v.stderr) console.error(v.stderr);
}

const list = runNode("apps/cli/bin/agenticx402.mjs", ["list"]);
if (list.status === 0) {
  ok("cli list");
} else {
  fail("cli list");
  if (list.stderr) console.error(list.stderr);
}

const secret = process.env.STELLAR_SECRET_KEY?.trim();
const smokeUrl = process.env.X402_SMOKE_URL?.trim();

if (secret && smokeUrl) {
  const fetchRes = runNode("apps/cli/bin/agenticx402.mjs", ["fetch", smokeUrl]);
  if (fetchRes.status === 0) {
    ok(`cli fetch (402 smoke) — URL configurada vía X402_SMOKE_URL`);
  } else {
    fail("cli fetch (402 smoke) — revisa fondos testnet, X402_SMOKE_URL y facilitator");
    if (fetchRes.stderr) console.error(fetchRes.stderr);
  }
} else if (secret && !smokeUrl) {
  console.log(
    "\n  ℹ STELLAR_SECRET_KEY está definida; define X402_SMOKE_URL (p. ej. endpoint de xlm402.com) para probar pago 402 automáticamente."
  );
} else {
  console.log(
    "\n  ℹ Define STELLAR_SECRET_KEY (p. ej. en .env) y X402_SMOKE_URL para ejecutar aquí la prueba automática de pago 402; si no, haz un fetch manual. Ver docs/setup-fase-0.md."
  );
}

console.log("");
if (failed) {
  process.exit(1);
}
console.log("Listo: anota tu fila en docs/PROGRESS.md (Fase 0) cuando el flujo real con wallet también esté OK.\n");
