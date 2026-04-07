/**
 * Carga `.env` en la raíz del repo (nombre `agenticx402` en package.json).
 * Así no hace falta `export STELLAR_SECRET_KEY` en cada terminal.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { config } from "dotenv";

export function loadRepoEnv() {
  let dir = process.cwd();
  for (;;) {
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
        if (pkg.name === "agenticx402") {
          const envPath = join(dir, ".env");
          if (existsSync(envPath)) {
            config({ path: envPath });
          }
          return;
        }
      } catch {
        /* ignorar package.json inválido */
      }
    }
    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  const fallback = join(process.cwd(), ".env");
  if (existsSync(fallback)) {
    config({ path: fallback });
  }
}
