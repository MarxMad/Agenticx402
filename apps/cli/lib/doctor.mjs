import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCatalog } from "./catalog-load.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "../../..");

function ok(msg) {
  return "  ✓ " + msg;
}

function warn(msg) {
  return "  ○ " + msg;
}

function bad(msg) {
  return "  ✗ " + msg;
}

function stellarSecretLooksValid(key) {
  if (!key || typeof key !== "string") return false;
  const t = key.trim();
  return /^S[ABCDEFGHIJKLMNOPQRSTUVWXYZ234567]{55}$/.test(t);
}

/**
 * Comprueba entorno mínimo para usar fetch/call con x402.
 */
export async function runDoctor() {
  const lines = [];
  lines.push("");
  lines.push("PumaX402 CLI — comprobación del entorno");
  lines.push("");

  const node = process.versions.node;
  const major = Number(node.split(".")[0]);
  if (major >= 20) {
    lines.push(ok(`Node.js ${node} (requerido: >=20)`));
  } else {
    lines.push(bad(`Node.js ${node} — actualiza a Node 20 o superior`));
  }

  const sk = process.env.STELLAR_SECRET_KEY?.trim();
  if (!sk) {
    lines.push(warn("STELLAR_SECRET_KEY no definida — necesaria para firmar pagos 402"));
  } else if (stellarSecretLooksValid(sk)) {
    lines.push(ok("STELLAR_SECRET_KEY definida (formato de clave Stellar reconocible)"));
  } else {
    lines.push(warn("STELLAR_SECRET_KEY definida pero el formato no parece una clave S… estándar"));
  }

  const net = process.env.STELLAR_NETWORK === "pubnet" ? "pubnet" : "testnet";
  lines.push(ok(`STELLAR_NETWORK efectiva: ${net} ${process.env.STELLAR_NETWORK ? "" : "(default)"}`));

  if (process.env.STELLAR_SOROBAN_RPC_URL?.trim()) {
    lines.push(ok("STELLAR_SOROBAN_RPC_URL personalizado"));
  } else {
    lines.push(warn("STELLAR_SOROBAN_RPC_URL — usando default del paquete @x402/stellar"));
  }

  if (process.env.AGENTICX402_CATALOG_URL?.trim()) {
    lines.push(ok(`AGENTICX402_CATALOG_URL=${process.env.AGENTICX402_CATALOG_URL.trim()}`));
  } else if (process.env.AGENTICX402_CATALOG_FILE?.trim()) {
    lines.push(ok(`AGENTICX402_CATALOG_FILE=${process.env.AGENTICX402_CATALOG_FILE.trim()}`));
  } else {
    lines.push(warn("Catálogo: archivo local del repo (catalog/services.json)"));
  }

  if (process.env.AGENTICX402_ENV_FILE?.trim()) {
    lines.push(ok(`AGENTICX402_ENV_FILE=${process.env.AGENTICX402_ENV_FILE.trim()}`));
  }

  lines.push("");
  lines.push("Catálogo:");

  try {
    const catalog = await loadCatalog();
    const n = catalog.services?.length ?? 0;
    const v = catalog.version ?? "?";
    const netDef = catalog.networkDefault || "—";
    lines.push(ok(`v${v} · ${n} servicios · red por defecto: ${netDef}`));
  } catch (e) {
    lines.push(bad((e instanceof Error ? e.message : String(e)) || "No se pudo cargar el catálogo"));
    lines.push("");
    lines.push("  Sugerencias:");
    lines.push('    · Define AGENTICX402_CATALOG_URL="https://tu-hub/services" si usas un hub desplegado');
    lines.push("    · O AGENTICX402_CATALOG_FILE=/ruta/a/services.json");
    lines.push("    · O ejecuta el CLI desde la raíz del repositorio clonado");
  }

  lines.push("");
  lines.push("Recordatorios para pagar x402 (testnet + USDC):");
  lines.push("  · Cuenta con XLM para fees y trustline al USDC del emisor (Circle testnet)");
  lines.push("  · Guía: docs/agents-stellar-trustline.md en el repo");
  lines.push("  · Endpoints de prueba: https://xlm402.com");
  lines.push("");
  console.log(lines.join("\n"));
}

export function readCliVersionLine() {
  try {
    const pkgPath = path.join(REPO_ROOT, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const v = pkg.version ? " v" + pkg.version : "";
    return (pkg.name || "agenticx402") + v;
  } catch {
    return "agenticx402";
  }
}
