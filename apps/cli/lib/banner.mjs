/**
 * Banner inspirado en el emblema del equipo (oro sobre azul marino, anillos, x402).
 * Referencia: /assets/logo.png
 *
 * AGENTICX402_NO_BANNER=1 — ocultar
 * NO_COLOR=1 — sin ANSI
 */

const ansi = {
  x: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  bg: "\x1b[48;5;17m",
  gold: "\x1b[38;5;220m",
  goldMid: "\x1b[38;5;178m",
  goldDim: "\x1b[38;5;136m",
};

const INNER = 41;

/** Cada fila: exactamente INNER columnas (monoespacio). */
const MEDALLION = [
  " ╭──────────────────────────────────────╮",
  "╱· · · · · · · · · · · · · · · · · · · ·╲",
  "│· · ╭──────────────────────────╮ · ○ ·═│",
  "│ ·╱· ●··············●············╲─·─·○│",
  "│·│ ·▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀···│·│·│",
  "│ │·▓▓▓▓▓▓▓▓▓▓▓··················─·─│·│·│",
  "│·│ ·╲···············▽···········╱··│·│·│",
  "│ │·╲__╲─────────────────────────╱_·─·╱·│",
  "│·│ ·╲······························╱···│",
  "│ ╲· ·╲_____________________________╱··╱│",
  "╲· · · ·╲_________________________╱· · ·╱",
  " ╰──────────────────────────────────────╯",
  "········x····4····0····2·················",
];

function noAnsi() {
  return process.env.NO_COLOR === "1" || process.env.NO_COLOR === "true";
}

function bannerOff() {
  return (
    process.env.AGENTICX402_NO_BANNER === "1" ||
    process.env.AGENTICX402_NO_BANNER === "true"
  );
}

function row(text, opts = {}) {
  const t = text.length === INNER ? text : text.slice(0, INNER).padEnd(INNER);
  const body = `  ${t}  `;
  if (noAnsi()) {
    return body;
  }
  const { dim = false, mid = false } = opts;
  const fg = dim ? ansi.goldDim : mid ? ansi.goldMid : ansi.gold;
  return `${ansi.bg}${ansi.bold}${fg}${body}${ansi.x}`;
}

function subtitle(text) {
  if (noAnsi()) {
    return `  ${text}`;
  }
  return `${ansi.dim}${ansi.goldMid}  ${text}${ansi.x}`;
}

export function printBannerFull() {
  if (bannerOff()) return;

  console.log("");
  for (const line of MEDALLION) {
    console.log(row(line));
  }
  console.log(row(" agenticx402 · Stellar · hub ".padEnd(INNER), { mid: true }));
  console.log("");
  console.log(subtitle("pay-per-request · HTTP 402 · Soroban"));
  console.log("");
}

export function printBannerMini() {
  if (bannerOff()) return;
  if (noAnsi()) {
    console.log("  [ x402 ]  agenticx402 · Stellar");
    return;
  }
  const seg = `${ansi.bg}${ansi.bold}${ansi.gold} x402 ${ansi.x}`;
  console.log(
    `${ansi.dim}╭${ansi.x}${seg}${ansi.dim}╼${ansi.x} ${ansi.bold}${ansi.goldMid}agenticx402${ansi.x} ${ansi.dim}·${ansi.x} ${ansi.gold}Stellar${ansi.x}`
  );
}
