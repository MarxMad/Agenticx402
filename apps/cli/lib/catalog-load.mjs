import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.join(__dirname, "../../..");

/**
 * @returns {Promise<{ version: number, networkDefault?: string, services: object[] }>}
 */
export async function loadCatalog() {
  const url = process.env.AGENTICX402_CATALOG_URL?.trim();
  if (url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Catálogo HTTP ${res.status}: ${url}`);
    }
    return res.json();
  }
  const file =
    process.env.AGENTICX402_CATALOG_FILE?.trim() ||
    path.join(REPO_ROOT, "catalog", "services.json");
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw);
}

export function findService(catalog, id) {
  const s = catalog.services?.find((x) => x.id === id);
  if (!s) {
    const ids = (catalog.services || []).map((x) => x.id).join(", ");
    throw new Error(`Servicio "${id}" no encontrado. Disponibles: ${ids || "(ninguno)"}`);
  }
  return s;
}

export function resolveServiceUrl(service, pathSuffix) {
  const base = service.baseUrl?.replace(/\/$/, "") || "";
  if (!pathSuffix || pathSuffix === "/") {
    return base || service.baseUrl;
  }
  const p = pathSuffix.startsWith("/") ? pathSuffix : `/${pathSuffix}`;
  return `${base}${p}`;
}
