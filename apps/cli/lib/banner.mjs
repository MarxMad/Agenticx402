/**
 * Identidad de terminal: cartel **PUMAX402** en bloques pixel (█ + sombra ▒); parte de los bloques en **azul tenue**.
 * Solo colores de primer plano (sin pintar fondo del terminal).
 *
 * AGENTICX402_NO_BANNER=1 — ocultar
 * NO_COLOR=1 — sin códigos ANSI (usa # y : en lugar de bloques)
 */

import {
  buildPixelBrandBlock,
  paintPixelArtLines,
} from "./banner-pixel.mjs";

const t = {
  x: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  /** Acento que suele verse bien en temas claro y oscuro */
  acc: "\x1b[36m",
  muted: "\x1b[90m",
};

export function noAnsi() {
  return process.env.NO_COLOR === "1" || process.env.NO_COLOR === "true";
}

export function bannerOff() {
  return (
    process.env.AGENTICX402_NO_BANNER === "1" ||
    process.env.AGENTICX402_NO_BANNER === "true"
  );
}

function S(kind, text) {
  if (noAnsi()) return text;
  if (kind === "title") {
    return `${t.bold}${t.acc}${text}${t.x}`;
  }
  if (kind === "muted") {
    return `${t.dim}${t.muted}${text}${t.x}`;
  }
  if (kind === "accent") {
    return `${t.acc}${text}${t.x}`;
  }
  return `${t.dim}${text}${t.x}`;
}

/** Línea con sangría; `kind`: title | muted | default */
export function paintBannerRow(text, opts = {}) {
  const kind = opts.kind ?? "default";
  return `  ${S(kind, text)}`;
}

export function paintSubtitle(text) {
  return `  ${S("muted", text)}`;
}

/**
 * Cabecera pixel + tagline + regla (compartida por `help` y `splash`).
 * @param {{ tagline?: string }} [opts]
 * @returns {number|undefined} `ruleWidth` impreso, o `undefined` si el banner está desactivado
 */
export function printBrandHeader(opts = {}) {
  if (bannerOff()) return undefined;
  const no = noAnsi();
  const block = buildPixelBrandBlock({
    noAnsi: no,
    maxWidth: 76,
    indent: "  ",
    tagline: opts.tagline,
  });
  const lines = paintPixelArtLines(block.artLines, no, 0);
  console.log("");
  for (const ln of lines) console.log(ln);
  console.log(paintSubtitle(block.taglineText));
  console.log(paintBannerRow("─".repeat(block.ruleWidth), { kind: "muted" }));
  console.log("");
  return block.ruleWidth;
}

/** Fotogramas del cartel en `splash --animate` (TTY + color). */
const BRAND_ANIM_FRAMES = 28;
const BRAND_ANIM_MS = 72;

/**
 * Igual que `printBrandHeader` pero redibuja el bloque pixel en bucle (onda azul / blanco).
 * Si no hay TTY o `NO_COLOR`, hace fallback a cabecera estática.
 * @returns {Promise<number|undefined>}
 */
export async function printBrandHeaderAnimated(opts = {}) {
  if (bannerOff()) return undefined;
  const no = noAnsi();
  const tty = process.stdout.isTTY;
  if (no || !tty) {
    return printBrandHeader(opts);
  }

  const block = buildPixelBrandBlock({
    noAnsi: false,
    maxWidth: 76,
    indent: "  ",
    tagline: opts.tagline,
  });
  const h = block.artLines.length;
  console.log("");
  for (let f = 0; f < BRAND_ANIM_FRAMES; f++) {
    const painted = paintPixelArtLines(block.artLines, false, f);
    if (f > 0) process.stdout.write(`\x1b[${h}A`);
    for (const ln of painted) {
      process.stdout.write(`${ln}\x1b[K\n`);
    }
    await new Promise((r) => setTimeout(r, BRAND_ANIM_MS));
  }
  console.log(paintSubtitle(block.taglineText));
  console.log(paintBannerRow("─".repeat(block.ruleWidth), { kind: "muted" }));
  console.log("");
  return block.ruleWidth;
}

export function printBannerFull() {
  printBrandHeader();
}

export function printBannerMini() {
  if (bannerOff()) return;
  if (noAnsi()) {
    console.log("  PumaX402  ·  Stellar x402");
    return;
  }
  console.log(
    `  ${t.bold}${t.acc}PumaX402${t.x} ${t.dim}${t.muted}·${t.x} ${t.dim}Stellar x402${t.x}`
  );
}
