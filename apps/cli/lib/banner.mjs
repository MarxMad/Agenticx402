/**
 * Identidad de terminal minimalista: solo colores de primer plano (sin pintar fondo).
 * Acento cian + negrita para la marca; gris atenuado para reglas y ayuda.
 *
 * AGENTICX402_NO_BANNER=1 — ocultar
 * NO_COLOR=1 — sin códigos ANSI
 */

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

const RULE_LEN = 44;

export function printBannerFull() {
  if (bannerOff()) return;

  console.log("");
  console.log(paintBannerRow("agenticx402", { kind: "title" }));
  console.log(
    paintBannerRow("Stellar · HTTP 402 · pay-per-request", { kind: "muted" })
  );
  console.log(paintBannerRow("─".repeat(RULE_LEN), { kind: "muted" }));
  console.log("");
}

export function printBannerMini() {
  if (bannerOff()) return;
  if (noAnsi()) {
    console.log("  agenticx402  ·  Stellar x402");
    return;
  }
  console.log(
    `  ${t.bold}${t.acc}agenticx402${t.x} ${t.dim}${t.muted}·${t.x} ${t.dim}Stellar x402${t.x}`
  );
}
