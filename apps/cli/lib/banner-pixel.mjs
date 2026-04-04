/**
 * Logo **PUMAX402** en bloques █ + sombra desplazada (estilo retro / pixel).
 * Sin fondo ANSI; sombra ▒. Mayúsculas para lectura tipo cartel.
 */

/** Palabra renderizada en el arte (cartel); la marca sigue siendo PumaX402 en copy. */
export const PIXEL_BRAND_WORD = "PUMAX402";

const GLYPHS = {
  P: ["████", "█  █", "████", "█   ", "█   "],
  U: ["█   █", "█   █", "█   █", "█   █", " ███ "],
  M: ["██   ██", "█ █ █ █", "█  █  █", "█     █", "█     █"],
  A: [" ███ ", "█   █", "█████", "█   █", "█   █"],
  X: ["██   ██", " ██ ██ ", "  ███  ", " ██ ██ ", "██   ██"],
  "4": ["   ██ ", "  █ █ ", " █  █ ", " █████ ", "    █ "],
  "0": [" ███ ", "█   █", "█   █", "█   █", " ███ "],
  "2": ["█████", "    █", "█████", "█    ", "█████"],
};

const MAIN = "█";
const SHADOW = "▒";
/** Desplazamiento de la “extrusión” pixel (abajo / derecha), por glifo */
const SHADOW_DR = 1;
const SHADOW_DC = 2;

/**
 * Sombra por letra: copia del bloque desplazada, luego capa principal encima.
 * Así la sombra no cruza huecos entre letras vecinas.
 * @param {string[]} glyphRows5 — 5 filas, mismo ancho lógico
 * @returns {string[]} 6 filas típicamente
 */
function mergeGlyphShadow(glyphRows5) {
  const h = 5;
  const w = Math.max(...glyphRows5.map((l) => l.length));
  const grid = glyphRows5.map((l) => l.padEnd(w, " ").split(""));
  const H = h + SHADOW_DR;
  const W = w + SHADOW_DC;
  const cells = Array.from({ length: H }, () => Array(W).fill(" "));

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (grid[r][c] === MAIN) {
        const sr = r + SHADOW_DR;
        const sc = c + SHADOW_DC;
        if (sr < H && sc < W) cells[sr][sc] = SHADOW;
      }
    }
  }
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (grid[r][c] === MAIN) cells[r][c] = MAIN;
    }
  }

  const lines = cells.map((row) => row.join(""));
  const maxL = Math.max(...lines.map((l) => l.length));
  return lines.map((l) => l.padEnd(maxL, " "));
}

/**
 * @param {string} word ej. "PUMAX402"
 * @returns {string[]}
 */
function composeWordPixel(word) {
  const blocks = [];
  for (const ch of word) {
    const g = GLYPHS[ch];
    if (!g) continue;
    const gw = Math.max(...g.map((row) => row.length));
    const normalized = g.map((row) => row.padEnd(gw, " "));
    blocks.push(mergeGlyphShadow(normalized));
  }
  if (blocks.length === 0) return [];
  const height = blocks[0].length;
  const rows = [];
  for (let i = 0; i < height; i++) {
    rows.push(blocks.map((b) => b[i]).join(" ").replace(/ +$/, ""));
  }
  const maxRowW = Math.max(...rows.map((r) => r.length), 0);
  return rows.map((r) => r.padEnd(maxRowW, " "));
}

function centerLine(line, totalWidth, padChar = " ") {
  const t = line.length;
  if (t >= totalWidth) return line;
  const left = Math.floor((totalWidth - t) / 2);
  return padChar.repeat(left) + line;
}

/**
 * @param {{ noAnsi?: boolean, maxWidth?: number, indent?: string, tagline?: string }} opts
 * @returns {{ artLines: string[], taglineText: string, ruleWidth: number, blockWidth: number }}
 */
export function buildPixelBrandBlock(opts = {}) {
  const noAnsi = Boolean(opts.noAnsi);
  const maxWidth = opts.maxWidth ?? 76;
  const indent = opts.indent ?? "  ";
  const tag =
    opts.tagline ?? "STELLAR · HTTP 402 · PAY-PER-REQUEST";

  const rawLines = composeWordPixel(PIXEL_BRAND_WORD);
  const blockW = Math.max(...rawLines.map((l) => l.length), 0);

  const innerMax = maxWidth - indent.length;
  const tagTrim = tag.slice(0, innerMax);
  const taglineLine = centerLine(tagTrim, Math.max(blockW, tagTrim.length), " ").slice(
    0,
    innerMax
  );

  const artLines = rawLines.map((row) => {
    const centered = centerLine(row, Math.max(blockW, taglineLine.length), " ");
    const clipped =
      centered.length > innerMax
        ? centered.slice(0, innerMax)
        : centered;
    return indent + clipped;
  });

  const ruleW = Math.min(
    Math.max(blockW, taglineLine.length),
    innerMax
  );
  const taglineText = centerLine(tagTrim, ruleW, " ");

  if (noAnsi) {
    const plain = artLines.map((l) =>
      l
        .replaceAll(MAIN, "#")
        .replaceAll(SHADOW, ":")
    );
    return {
      artLines: plain,
      taglineText,
      ruleWidth: ruleW,
      blockWidth: blockW,
    };
  }

  return {
    artLines,
    taglineText,
    ruleWidth: ruleW,
    blockWidth: blockW,
  };
}

const ansi = {
  x: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  /** Blanco cartel */
  main: "\x1b[1m\x1b[97m",
  /** Azul tenue (bloques destacados) */
  mainBlue: "\x1b[2m\x1b[94m",
  shadow: "\x1b[2m\x1b[90m",
  /** Sombra con ligero matiz azul */
  shadowBlue: "\x1b[2m\x1b[34m",
  tag: "\x1b[2m\x1b[37m",
};

/** Onda diagonal que avanza con `frame` (determinista, sin floats). */
function mainBlueAt(row, col, frame) {
  const w = (row * 19 + col * 13 + frame * 6) % 20;
  return w < 5;
}

function shadowBlueAt(row, col, frame) {
  const w = (row * 11 + col * 17 + frame * 5) % 23;
  return w < 3;
}

/**
 * @param {string[]} artLines
 * @param {boolean} noAnsi
 * @param {number} [frame=0] fotograma para animación / parpadeo azul
 */
export function paintPixelArtLines(artLines, noAnsi, frame = 0) {
  if (noAnsi) return artLines;
  const f = ((frame % 512) + 512) % 512;
  return artLines.map((line, row) => {
    let s = "";
    let col = 0;
    for (const ch of line) {
      if (ch === MAIN) {
        if (mainBlueAt(row, col, f)) {
          s += `${ansi.mainBlue}${MAIN}${ansi.x}`;
        } else {
          s += `${ansi.main}${MAIN}${ansi.x}`;
        }
        col++;
      } else if (ch === SHADOW) {
        if (shadowBlueAt(row, col, f)) {
          s += `${ansi.shadowBlue}${SHADOW}${ansi.x}`;
        } else {
          s += `${ansi.shadow}${SHADOW}${ansi.x}`;
        }
        col++;
      } else {
        s += ch;
        col++;
      }
    }
    return s;
  });
}

