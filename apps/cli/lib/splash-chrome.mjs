/**
 * Pantalla de bienvenida: cartel pixel + comandos. Fondo = el del tema del terminal.
 * `--animate` (TTY + color): el bloque **PUMAX402** se redibuja unos segundos (onda azul/blanco).
 */

import {
  printBrandHeader,
  printBrandHeaderAnimated,
  paintBannerRow,
  paintSubtitle,
  noAnsi,
  bannerOff,
} from "./banner.mjs";

const SPLASH_TAGLINE = "CLI · STELLAR TESTNET · X402";

function printBodyCommands(ruleW) {
  console.log(paintBannerRow("Comandos", { kind: "accent" }));
  console.log(paintBannerRow("  list              catálogo de servicios", { kind: "default" }));
  console.log(paintBannerRow("  fetch <url>       HTTP + flujo 402 si aplica", { kind: "default" }));
  console.log(
    paintBannerRow("  call <id> --path  URL desde el catálogo", { kind: "default" })
  );
  console.log(paintBannerRow("  splash            esta pantalla", { kind: "default" }));
  console.log("");
  console.log(paintBannerRow("─".repeat(ruleW), { kind: "muted" }));
  console.log(paintSubtitle("Ayuda: npm run cli -- -h"));
  console.log("");
}

export function printSplashStatic() {
  if (bannerOff()) {
    console.log("(splash desactivado: AGENTICX402_NO_BANNER=1)");
    return;
  }
  const ruleW = printBrandHeader({ tagline: SPLASH_TAGLINE }) ?? 44;
  printBodyCommands(ruleW);
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

  const ruleW =
    animate && tty && !noAnsi()
      ? (await printBrandHeaderAnimated({ tagline: SPLASH_TAGLINE })) ?? 44
      : (printBrandHeader({ tagline: SPLASH_TAGLINE }) ?? 44);

  printBodyCommands(ruleW);

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
