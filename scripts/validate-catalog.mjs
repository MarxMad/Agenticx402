#!/usr/bin/env node
/**
 * Valida estructura mínima de catalog/services.json (Fase 1).
 * Uso: npm run catalog:validate
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const catalogPath = path.join(root, "catalog", "services.json");

const requiredService = ["id", "name", "baseUrl", "tags", "status", "source"];

function fail(msg) {
  console.error("catalog:validate —", msg);
  process.exit(1);
}

let raw;
try {
  raw = fs.readFileSync(catalogPath, "utf8");
} catch {
  fail(`no se encuentra ${catalogPath}`);
}

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  fail(`JSON inválido: ${e.message}`);
}

if (typeof data.version !== "number") {
  fail('falta "version" numérica en la raíz');
}

if (!Array.isArray(data.services)) {
  fail('falta array "services"');
}

const ids = new Set();
for (let i = 0; i < data.services.length; i++) {
  const s = data.services[i];
  const prefix = `services[${i}]`;
  if (!s || typeof s !== "object") {
    fail(`${prefix}: entrada no es objeto`);
  }
  for (const k of requiredService) {
    if (s[k] === undefined || s[k] === null || s[k] === "") {
      fail(`${prefix}: falta o vacío "${k}"`);
    }
  }
  if (!Array.isArray(s.tags)) {
    fail(`${prefix}: "tags" debe ser array`);
  }
  if (ids.has(s.id)) {
    fail(`id duplicado: ${s.id}`);
  }
  ids.add(s.id);
}

console.log(
  `OK — ${data.services.length} servicio(s), version ${data.version}, archivo ${path.relative(root, catalogPath)}`
);
process.exit(0);
