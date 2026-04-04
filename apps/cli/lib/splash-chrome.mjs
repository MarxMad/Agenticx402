/**
 * Pantalla de bienvenida sobria: tipografía + reglas, fondo = el del tema del terminal.
 * --animate: solo un indicador breve en una línea (sin limpiar pantalla completa).
 */

import { paintBannerRow, paintSubtitle, noAnsi, bannerOff } from "./banner.mjs";

function printBody() {
  console.log("");
  console.log(paintBannerRow("agenticx402", { kind: "title" }));
  console.log(paintBannerRow("CLI · Stellar testnet · x402", { kind: "muted" }));
  console.log(paintBannerRow("─".repeat(44), { kind: "muted" }));
  console.log("");
  console.log(paintBannerRow("Comandos", { kind: "accent" }));
  console.log(paintBannerRow("  list              catálogo de servicios", { kind: "default" }));
  console.log(paintBannerRow("  fetch <url>       HTTP + flujo 402 si aplica", { kind: "default" }));
  console.log(
    paintBannerRow("  call <id> --path  URL desde el catálogo", { kind: "default" })
  );
  console.log(paintBannerRow("  splash            esta pantalla", { kind: "default" }));
  console.log("");
  console.log(paintBannerRow("─".repeat(44), { kind: "muted" }));
  console.log(paintSubtitle("Ayuda: npm run cli -- -h"));
  console.log("");
}

export function printSplashStatic() {
  if (bannerOff()) {
    console.log("(splash desactivado: AGENTICX402_NO_BANNER=1)");
    return;
  }
  printBody();
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

  printBody();

  if (animate && tty && !noAnsi()) {
    const frames = [" ·  ", " ·· ", " ···", "  ··"];
    const dim = "\x1b[2m\x1b[90m";
    const x = "\x1b[0m";
    for (let i = 0; i < 10; i++) {
      process.stdout.write(`\r  ${dim}${frames[i % 4]}${x} listo`);
      await new Promise((r) => setTimeout(r, 100));
    }
    process.stdout.write("\n\n");
  }
}
