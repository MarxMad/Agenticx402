/**
 * Banner retro / “pixel” (ANSI opcional).
 * Ocultar del todo: AGENTICX402_NO_BANNER=1
 * Sin color pero con dibujo: NO_COLOR=1 (solo se quitan códigos ANSI)
 */

const ansi = {
  x: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  p: "\x1b[38;5;141m",
  pHi: "\x1b[38;5;183m",
  edge: "\x1b[38;5;238m",
  accent: "\x1b[38;5;45m",
};

function noAnsi() {
  return process.env.NO_COLOR === "1" || process.env.NO_COLOR === "true";
}

function bannerOff() {
  return (
    process.env.AGENTICX402_NO_BANNER === "1" ||
    process.env.AGENTICX402_NO_BANNER === "true"
  );
}

function c(code, text) {
  if (noAnsi()) return text;
  return `${code}${text}${ansi.x}`;
}

/** Bloques tipo pixel + marca (para --help y sin subcomando). */
export function printBannerFull() {
  if (bannerOff()) return;
  const e = (t) => c(ansi.edge, t);
  const p = (t) => c(ansi.p, t);
  const ph = (t) => c(ansi.pHi, t);
  const a = (t) => c(ansi.accent, t);
  const lines = [
    "",
    `${e("    ")}${p("▄▄████▄▄")}${e("    ")}`,
    `${e("  ")}${p("▄█")}${e("▀▀")}${e("····")}${e("▀▀")}${p("█▄")}${e("  ")}`,
    `${e("  ")}${p("█")}${e("··")}${ph("◆")}${e("··")}${a("402")}${e("··")}${p("█")}${e("  ")}`,
    `${e("  ")}${p("▀█▄▄")}${e("····")}${p("▄▄█▀")}${e("  ")}`,
    `${e("    ")}${p("▀▀████▀▀")}${e("    ")}`,
    `${c(ansi.dim, "  ─────────────────────────")}`,
    `  ${c(ansi.bold + ansi.p, "agenticx402")}${c(ansi.dim, " · ")}${a("x402")}${c(ansi.dim, " + ")}${ph("Stellar")}${c(ansi.dim, " · pay-per-request hub")}`,
    "",
  ];
  console.log(lines.join("\n"));
}

/** Una línea, para `list`. */
export function printBannerMini() {
  if (bannerOff()) return;
  const e = (t) => c(ansi.edge, t);
  const p = (t) => c(ansi.p, t);
  const ph = (t) => c(ansi.pHi, t);
  const a = (t) => c(ansi.accent, t);
  console.log(
    `${e("╭")} ${ph("◆")} ${c(ansi.bold + ansi.p, "agenticx402")} ${c(ansi.dim, "·")} ${a("x402")} ${c(ansi.dim, "·")} ${ph("Stellar")} ${e("╼")}`
  );
}
