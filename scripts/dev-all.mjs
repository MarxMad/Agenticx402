#!/usr/bin/env node
/**
 * dev-all: levanta todos los microservicios PumaX402 en paralelo.
 * Carga .env de la raíz del repo (si existe) y hereda process.env.
 * Uso: npm run dev:all
 */
import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// ─── carga .env ───────────────────────────────────────────────────────────────
function loadDotEnv() {
  const envPath = resolve(ROOT, ".env");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx < 1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !(key in process.env)) process.env[key] = val;
  }
}
loadDotEnv();

// ─── colores ANSI ─────────────────────────────────────────────────────────────
const COLORS = ["\x1b[36m", "\x1b[32m", "\x1b[33m", "\x1b[35m", "\x1b[34m"];
const RESET = "\x1b[0m";

// ─── definición de servicios ──────────────────────────────────────────────────
const SERVICES = [
  {
    name: "catalog   ",
    script: "apps/catalog-api/server.mjs",
    env: {},
  },
  {
    name: "pulse     ",
    script: "apps/puma-service/server.mjs",
    env: {},           // necesita PUMA_X402_PAYTO en .env
  },
  {
    name: "dex-signal",
    script: "apps/stellar-dex-signal/server.mjs",
    env: {},           // necesita DEX_X402_PAYTO + DEX_DEFAULT_BUYING_ISSUER
  },
  {
    name: "geo-risk  ",
    script: "apps/geopolitical-risk/server.mjs",
    env: {},           // necesita GEO_X402_PAYTO + GEO_UPSTREAM_SECRET_KEY
  },
  {
    name: "energy    ",
    script: "apps/energy-signal/server.mjs",
    env: {},           // necesita ENERGY_X402_PAYTO; GROQ_API_KEY opcional
  },
];

// ─── spawn ────────────────────────────────────────────────────────────────────
const procs = [];

SERVICES.forEach(({ name, script, env }, i) => {
  const color = COLORS[i % COLORS.length];
  const prefix = `${color}[${name}]${RESET} `;

  const child = spawn("node", [resolve(ROOT, script)], {
    env: { ...process.env, ...env },
    cwd: ROOT,
  });

  procs.push(child);

  const pipe = (stream, isErr) => {
    stream.setEncoding("utf8");
    stream.on("data", (chunk) => {
      const lines = chunk.replace(/\n$/, "").split("\n");
      for (const l of lines) {
        process[isErr ? "stderr" : "stdout"].write(`${prefix}${l}\n`);
      }
    });
  };

  pipe(child.stdout, false);
  pipe(child.stderr, true);

  child.on("exit", (code) => {
    if (code !== null && code !== 0) {
      console.error(`${prefix}salió con código ${code}`);
    }
  });
});

console.log(`\n  PumaX402 dev:all — ${SERVICES.length} servicios arrancando…\n`);

// ─── apagado limpio ───────────────────────────────────────────────────────────
function shutdown() {
  console.log("\n  Apagando servicios…");
  for (const p of procs) {
    try { p.kill("SIGTERM"); } catch {}
  }
  setTimeout(() => process.exit(0), 1000);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
