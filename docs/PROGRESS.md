# Avance del proyecto (para colaboradores)

Este archivo es la **fuente de verdad operativa**: qué fase toca, qué ya está en el repo y qué falta. Actualízalo al cerrar tareas o al abrir PRs relevantes.

**Última revisión del documento:** 2026-04-06

---

## Resumen por fases

| Fase | Nombre | Estado en repo | Responsable típico | Siguiente acción |
|------|--------|----------------|----------------------|------------------|
| **0** | Aterrizaje (wallet + x402 end-to-end local) | **Guía + `npm run fase0:check`** — wallet y 402 real siguen siendo **por desarrollador** | Cada dev | [`setup-fase-0.md`](./setup-fase-0.md) + fila en tabla Fase 0 + opcional `X402_SMOKE_URL` |
| **1** | Cimientos del hub (catálogo + API + UI) | **Completa** | Core hub | Añadir entradas en `catalog/services.json` si hace falta |
| **2** | Cliente x402 (CLI) | **Completa** (código + docs); prueba 402 real = Fase 0 | Integración Stellar | Cada dev: `STELLAR_SECRET_KEY` + `npm run cli -- fetch "<url 402>"` |
| **3** | MCP / skill para agentes | **MCP stdio + guión demo** [`mcp-demo.md`](./mcp-demo.md) | Agent UX | Grabar vídeo; registrar servidor MCP en Cursor; 402 real = Fase 0 |
| **4** | Demo + deploy + pitch | **Docker + [`deploy.md`](./deploy.md)**; URL pública = acción del equipo | Todo el equipo | Desplegar hub; sustituir `TU-DOMINIO` en docs; vídeo + pitch |

**Leyenda de estado:** *Completa* = criterios de hecho del README cubiertos en código o docs del repo. *Guía lista* = el equipo debe ejecutar pasos fuera del repo (wallet, clone de x402-stellar).

---

## Fase 0 — Seguimiento local (obligatorio antes de integrar pagos reales)

Cada persona **añade una fila** cuando termine el checklist de [`setup-fase-0.md`](./setup-fase-0.md) y ejecute `npm run fase0:check` sin errores (más un `fetch`/`call` manual con testnet si quieres validar 402 fuera del script).

| Persona / alias | Fecha cierre Fase 0 | Nota (sin secretos) |
|-----------------|---------------------|----------------------|
| edgadafi | _2026-04-06_ | _ej. xlm402 — endpoint documentado; quickstart OK_ |

---

## Fase 1 — Qué hay implementado

| Componente | Ubicación | Cómo probarlo |
|------------|-----------|----------------|
| Datos del catálogo | [`catalog/services.json`](../catalog/services.json) | Editar y correr validación |
| Validación JSON | [`scripts/validate-catalog.mjs`](../scripts/validate-catalog.mjs) | `npm run catalog:validate` |
| API read-only | [`apps/catalog-api/server.mjs`](../apps/catalog-api/server.mjs) | `npm run catalog:dev` → `GET /services`, `GET /services/:id` |
| UI del hub | [`apps/catalog-web/index.html`](../apps/catalog-web/index.html) | Mismo servidor → `http://127.0.0.1:3840/` · pestaña **Documentación** (`#docs`): enlaces a guías + snippet MCP |
| Cómo dar de alta servicios | [`catalog/README.md`](../catalog/README.md) | PR con cambios en `services.json` |

**Criterios de hecho Fase 1 (revisión):**

- [x] Modelo de datos documentado y semilla en JSON
- [x] API `GET /services` y `GET /services/:id`
- [x] Página que lista servicios con filtro por texto y por tag
- [x] Instrucciones de alta en `catalog/README.md`
- [x] Script de validación del catálogo

---

## Fase 2 — Qué hay implementado

| Componente | Ubicación | Cómo probarlo |
|------------|-----------|----------------|
| Entrada CLI (PumaX402) | [`apps/cli/bin/agenticx402.mjs`](../apps/cli/bin/agenticx402.mjs) | `npm run cli -- help` |
| Catálogo (file / URL) | [`apps/cli/lib/catalog-load.mjs`](../apps/cli/lib/catalog-load.mjs) | `AGENTICX402_CATALOG_URL=… npm run cli -- list` |
| fetch con 402 | [`apps/cli/lib/x402-fetch.mjs`](../apps/cli/lib/x402-fetch.mjs) | Con `STELLAR_SECRET_KEY`: `npm run cli -- fetch "…"` |
| Variables | [`.env.example`](../.env.example) | Copiar a `.env` local (no git) |
| Guía | [`docs/cli.md`](./cli.md) | Instrucciones y expectativas testnet |

**Checklist colaborador (Fase 2 + 402 real):**

1. `npm run cli -- list`
2. Sin clave: `npm run cli -- fetch "https://…"` (si no es 402, debe imprimir JSON/texto).
3. Con clave testnet: `fetch` o `call <id> --path …` contra un endpoint documentado que devuelva 402.

---

## Fase 3 — Qué hay implementado

| Componente | Ubicación | Cómo probarlo |
|------------|-----------|----------------|
| **Agent Pulse** (x402 propio) | [`apps/puma-service/server.mjs`](../apps/puma-service/server.mjs) | `PUMA_X402_PAYTO=G... npm run puma-service` → `cli call pumax402-agent-pulse --path /v1/pulse` |
| **Stellar DEX Signal** | [`apps/stellar-dex-signal/server.mjs`](../apps/stellar-dex-signal/server.mjs) | `DEX_X402_PAYTO` + `DEX_DEFAULT_BUYING_ISSUER` → `npm run dex-signal` → `cli call pumax402-stellar-dex-signal --path /v1/signal` |
| **Geopolitical Risk** | [`apps/geopolitical-risk/server.mjs`](../apps/geopolitical-risk/server.mjs) | `GEO_X402_PAYTO` + `GEO_UPSTREAM_SECRET_KEY` → `npm run geopolitical-risk` → `cli call pumax402-geopolitical-risk --path "/v1/risk?region=global"` |
| Servidor MCP (stdio) | [`apps/mcp/server.mjs`](../apps/mcp/server.mjs) | `npm run mcp` — conectar con Inspector MCP o Cursor (`command` + `args`) |
| Tool `list_services` | mismo | Lista / filtra servicios del catálogo (mismas env vars que CLI) |
| Tool `call_service` | mismo | `service_id` + `path` (+ `method`); usa `STELLAR_SECRET_KEY` si hay 402 |

**Cursor (ejemplo):** servidor con `command` `node`, `args` `["/ruta/al/repo/apps/mcp/server.mjs"]`, `cwd` raíz del repo.

---

## Fase 4 — Deploy del hub (Docker)

| Artefacto | Ubicación | Notas |
|-----------|-----------|--------|
| Imagen | [`Dockerfile`](../Dockerfile) en la raíz | Solo `catalog/` + `apps/catalog-api` + `apps/catalog-web`; puerto por `PORT` (default 8080 en imagen). |
| Contexto | [`.dockerignore`](../.dockerignore) | Excluye CLI, MCP, `node_modules`, docs. |

**Orden recomendado:** build local → probar → publicar en registry o desplegar desde el mismo `Dockerfile` en Fly/Railway/Render.

---

## Fase 4 en adelante — Orden de trabajo recomendado

1. **Fase 4:** URL pública (desde Docker o buildpack Node ejecutando `node apps/catalog-api/server.mjs`), video de demo, pitch.
2. **Opcional:** skill Markdown duplicando instrucciones MCP para quien no use stdio.

---

## Changelog breve (repo)

| Fecha | Cambio |
|-------|--------|
| 2026-04-06 | Servicios x402 **stellar-dex-signal** ($0.05 Horizon) y **geopolitical-risk** ($0.08, upstream xlm402 news); catálogo + `npm run dex-signal` / `geopolitical-risk`. |
| 2026-04-06 | Fase 0: `npm run fase0:check` ([`scripts/fase-0-check.mjs`](../scripts/fase-0-check.mjs)), `X402_SMOKE_URL` en [`.env.example`](../.env.example); CI GitHub; [`docs/mcp-demo.md`](./mcp-demo.md); [`docs/deploy.md`](./deploy.md); tabla Fase 0 con plantilla de fila. |
| 2026-04-04 | `x402-stellar-panorama.md`: +25 ideas fuera de la caja (agentes, Soroban, MPP, passkeys, ética); refs `docs.md` y `llmstellar.txt`. |
| 2026-04-04 | **Agent Pulse**: servicio x402 propio (`apps/puma-service`), JSON “pulse” testnet para prompts de agentes; catálogo `pumax402-agent-pulse`; deps `@x402/express`, `express`. |
| 2026-04-04 | `docs/x402-stellar-panorama.md`: inventario de servicios/demos x402 en Stellar + tabla de ideas innovadoras; enlaces README/hub/PROGRESS. |
| 2026-04-04 | `docs/hackathon-jurado.md`: pitch, tabla Stellar/x402, deploy sin Docker (Render/Railway), por qué no Vercel tal cual, guion visual vídeo, Q&A jurado. |
| 2026-04-04 | Fase 4 (parcial): `Dockerfile` + `.dockerignore` para desplegar solo el hub (API + UI). |
| 2026-04-04 | Hub web: sección **Documentación** (`/#docs`) con enlaces a `docs/*` y JSON ejemplo MCP + copiar al portapapeles. |
| 2026-04-04 | Fase 3: MCP stdio `pumax402-mcp` (`list_services`, `call_service`), `@modelcontextprotocol/sdk`, script `npm run mcp`. |
| 2026-04-02 | Marca de producto **PumaX402** (banner/splash, catálogo web, README); bin npm y repo GitHub siguen `agenticx402` / Agenticx402. |
| 2026-04-02 | Fase 2: CLI PumaX402 (`list`, `fetch`, `call`), bin `agenticx402`, `@x402/core` + `@x402/stellar`, `.env.example`, `docs/cli.md` |
| 2026-04-02 | Fase 1 cerrada: UI en `/`, segundo servicio en catálogo, `catalog:validate`, `CONTRIBUTING.md` |

---

## Enlaces rápidos

- [README principal](../README.md) — visión y plan de fases
- [CLI](./cli.md)
- [MCP](./mcp.md) — servidor stdio para agentes
- [Demo MCP / Cursor](./mcp-demo.md)
- [Deploy del hub](./deploy.md)
- [Trustline USDC para agentes](./agents-stellar-trustline.md) — pagar x402 en testnet sin fallar por trustline
- [Hackathon / jurado](./hackathon-jurado.md) — pitch, Stellar+x402, Vercel vs Render, guion vídeo
- [Panorama x402 Stellar + ideas nuevas](./x402-stellar-panorama.md) — qué servicios ya existen, opciones de innovación
- [Modelo de negocio](../BUSINESS_MODEL.md)
- [Recursos Stellar / x402](./docs.md)
- [Guía setup Fase 0](./setup-fase-0.md)
