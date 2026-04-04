/**
 * Pantalla estilo “consola PUMA / x402”: cabecera, menú, constelaciones, medallón, prompt simulado.
 * Modo dinámico: redibuja el campo de estrellas (semilla distinta por frame) en TTY sin NO_COLOR.
 */

import {
  INNER,
  buildMedallion,
  paintBannerRow,
  paintSubtitle,
  noAnsi,
  bannerOff,
} from "./banner.mjs";

const GLYPHS = ["·", " ", "+", "'", "*", ".", ":", "╱", "╲"];

function titleBar() {
  const label = "[ PUMA x402 HUB · v0.1 ]";
  const eq = INNER - label.length;
  const left = Math.max(0, Math.floor(eq / 2));
  const right = Math.max(0, eq - left);
  return `${"=".repeat(left)}${label}${"=".repeat(right)}`.slice(0, INNER);
}

function menuBar() {
  const left = "File | Network | Stellar";
  const right = "[·]";
  const gap = INNER - left.length - right.length;
  return left + " ".repeat(Math.max(1, gap)) + right;
}

function dashLine(ch = "─") {
  return ch.repeat(INNER).slice(0, INNER);
}

/** Fila “constelación” determinista por semilla (cambia entre frames = sensación dinámica). */
export function cosmosRow(seed) {
  let s = "";
  let x = seed >>> 0;
  for (let i = 0; i < INNER; i++) {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    s += GLYPHS[x % GLYPHS.length];
  }
  return s;
}

function buildFrameLines(seedTop, seedBot) {
  const lines = [
    titleBar(),
    menuBar(),
    dashLine("-"),
    cosmosRow(seedTop),
    ...buildMedallion(),
    cosmosRow(seedBot),
    dashLine("─"),
    " puma@stellar-testnet:~$ status      ".slice(0, INNER).padEnd(INNER),
    " ▸ x402 routes ready · hub online    ".slice(0, INNER).padEnd(INNER),
    " puma@stellar-testnet:~$ █           ".slice(0, INNER).padEnd(INNER),
  ];
  return lines.map((t) => t.slice(0, INNER).padEnd(INNER));
}

export function printSplashStatic() {
  if (bannerOff()) {
    console.log("(splash desactivado: AGENTICX402_NO_BANNER=1)");
    return;
  }
  const lines = buildFrameLines(42_001, 90_009);
  console.log("");
  for (const raw of lines) {
    console.log(paintBannerRow(raw));
  }
  console.log(
    paintSubtitle("Modo estático. Animación: npm run cli -- splash --animate")
  );
  console.log("");
}

/**
 * @param {{ animate?: boolean }} opts
 */
export async function runSplash(opts = {}) {
  if (bannerOff()) {
    console.log("(splash desactivado: AGENTICX402_NO_BANNER=1)");
    return;
  }

  const animate = Boolean(opts.animate);
  const tty = process.stdout.isTTY;
  const canAnimate = animate && tty && !noAnsi();

  if (canAnimate) {
    process.stdout.write("\x1b[?25l");
    try {
      for (let frame = 0; frame < 20; frame++) {
        process.stdout.write("\x1b[2J\x1b[H");
        const top = frame * 1_403 + 11;
        const bot = frame * 977 + 53;
        const lines = buildFrameLines(top, bot);
        for (const raw of lines) {
          console.log(paintBannerRow(raw));
        }
        console.log(paintSubtitle("frame " + (frame + 1) + "/20 · constelación viva"));
        await new Promise((r) => setTimeout(r, 140));
      }
    } finally {
      process.stdout.write("\x1b[?25h");
    }
  }

  const lines = buildFrameLines(42_001, 90_009);
  if (canAnimate) {
    process.stdout.write("\x1b[2J\x1b[H");
  }
  console.log("");
  for (const raw of lines) {
    console.log(paintBannerRow(raw));
  }
  console.log(paintSubtitle("pay-per-request · HTTP 402 · Soroban"));
  console.log("");
}
