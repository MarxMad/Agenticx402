/**
 * Banner: puma en perfil (pixel █), anillo y x402 — oro sobre azul marino (ANSI).
 * Referencia marca: /assets/logo.png
 *
 * AGENTICX402_NO_BANNER=1 — ocultar
 * NO_COLOR=1 — sin ANSI (silueta en · y █)
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

/** Puma mirando a la derecha; cada fila = 37 cols (va dentro de │· … ·│). */
const PUMA_PIXEL = [
  "...........█.........................",
  "..........███........................",
  ".........█...█.......................",
  "........█.....█......................",
  ".......█...█....█....................",
  "......█....██....█...................",
  "......█.....█....█...................",
  "......█..........██..................",
  ".......█..........██.................",
  "........█...........█................",
  "........██.........██................",
  ".........████████████................",
];

function frameInner(body37) {
  return "│·" + body37 + "·│";
}

/** Convierte píxeles █ en bloques; con NO_COLOR se ven igual. */
function buildMedallion() {
  const top = " ╭" + "─".repeat(38) + "╮";
  const dots39 = "· ".repeat(19) + "·";
  const ring2 = "╱" + dots39 + "╲";
  const empty = frameInner("·".repeat(37));
  const netRow = frameInner(
    "····························○─·─○····"
  );

  const pumaRows = PUMA_PIXEL.map((row) => frameInner(row));

  const lower = "╲· · · ·╲_________________________╱· · ·╱";
  const bot = " ╰" + "─".repeat(38) + "╯";
  const x402core = "········x····4····0····2";
  const x402line = (x402core + "·".repeat(INNER)).slice(0, INNER);

  const lines = [
    top,
    ring2,
    empty,
    ...pumaRows,
    netRow,
    empty,
    lower,
    bot,
    x402line,
  ];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length !== INNER) {
      throw new Error(`banner línea ${i}: longitud ${lines[i].length}, esperado ${INNER}`);
    }
  }
  return lines;
}

const MEDALLION = buildMedallion();

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
    console.log("  [█ puma/x402 ]  agenticx402 · Stellar");
    return;
  }
  const pumaHint = `${ansi.bg}${ansi.bold}${ansi.gold}▄▀▄${ansi.x}`;
  const seg = `${ansi.bg}${ansi.bold}${ansi.gold} x402 ${ansi.x}`;
  console.log(
    `${ansi.dim}╭${ansi.x}${pumaHint}${seg}${ansi.dim}╼${ansi.x} ${ansi.bold}${ansi.goldMid}agenticx402${ansi.x} ${ansi.dim}·${ansi.x} ${ansi.gold}Stellar${ansi.x}`
  );
}
