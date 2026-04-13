# Project Progress (For Contributors)

This file is the **operational source of truth**: what phase is active, what is already in the repo, and what is missing. Update it when closing tasks or opening relevant PRs.

**Last Document Review:** 2026-04-13

---

## Change Log (April 2026)

| Fase | Nombre | Estado en repo | Responsable típico | Siguiente acción |
|------|--------|----------------|----------------------|------------------|
| **0** | Aterrizaje (wallet + x402 end-to-end local) | **Guía + `npm run fase0:check`** — wallet y 402 real siguen siendo **por desarrollador** | Cada dev | [`setup-fase-0.md`](./setup-fase-0.md) + fila en tabla Fase 0 + opcional `X402_SMOKE_URL` |
| **1** | Cimientos del hub (catálogo + API + UI) | **Completa** | Core hub | Añadir entradas en `catalog/services.json` si hace falta |
| **2** | Cliente x402 (CLI) | **Completa** (código + docs); prueba 402 real = Fase 0 | Integración Stellar | Cada dev: `STELLAR_SECRET_KEY` + `npm run cli -- fetch "<url 402>"` |
| **3** | MCP / skill para agentes | **MCP stdio + guión demo** [`mcp-demo.md`](./mcp-demo.md) | Agent UX | Grabar vídeo; registrar servidor MCP en Cursor; 402 real = Fase 0 |
| **4** | Demo + deploy + pitch | **Docker + [`deploy.md`](./deploy.md)**; hub Railway activo | Todo el equipo | Vídeo + pitch; URL: `https://agenticx402-production.up.railway.app/` |

**Leyenda de estado:** *Completa* = criterios de hecho del README cubiertos en código o docs del repo. *Guía lista* = el equipo debe ejecutar pasos fuera del repo (wallet, clone de x402-stellar).

---

## Fase 0 — Seguimiento local (obligatorio antes de integrar pagos reales)

Cada persona **añade una fila** cuando termine el checklist de [`setup-fase-0.md`](./setup-fase-0.md) y ejecute `npm run fase0:check` sin errores (más un `fetch`/`call` manual con testnet si quieres validar 402 fuera del script).

| Persona / alias | Fecha cierre Fase 0 | Nota (sin secretos) |
|-----------------|---------------------|----------------------|
| edgadafi | _2026-04-08_ | _dex-signal + geopolitical-risk OK testnet_ |

---

## Fase 1 — Qué hay implementado

| Componente | Ubicación | Cómo probarlo |
|------------|-----------|----------------|
| Datos del catálogo | [`catalog/services.json`](../catalog/services.json) | Editar y correr validación |
| Validación JSON | [`scripts/validate-catalog.mjs`](../scripts/validate-catalog.mjs) | `npm run catalog:validate` |
| API read-only | [`apps/catalog-api/server.mjs`](../apps/catalog-api/server.mjs) | `npm run catalog:dev` → `GET /services`, `GET /services/:id` |
| UI del hub | [`apps/catalog-web/index.html`](../apps/catalog-web/index.html) | Local: `npm run catalog:dev` → `http://127.0.0.1:3840/` · producción: [`agenticx402-production.up.railway.app`](https://agenticx402-production.up.railway.app/) |
| Cómo dar de alta servicios | [`catalog/README.md`](../catalog/README.md) | PR con cambios en `services.json` |

### [2026-04-13] Stellar Dev Skill Integration
- **Native Knowledge:** Integrated `./skill/` with guides on Soroban, x402, MPP, Security, Testing, and API (RPC vs Horizon).
- **Soroban Workspace:** Created `./soroban/contracts/hello_trustline` as a base example for smart contracts.
- **Microservices:** Audited `energy-signal` and implemented massive orchestration with `npm run dev:all`.
- **Standardization:** Updated `package.json` with build scripts and skill support.

---

## Phase Summary

| Phase | Name | Repo Status | Responsible | Next Action |
|------|--------|----------------|----------------------|------------------|
| **0** | Landing (Wallets + Local x402 E2E) | **Guide + `npm run fase0:check`** | Each Dev | Check `.env` + `X402_SMOKE_URL` |
| **1** | Hub Foundations (Catalog + API + UI) | **Complete** | Core Hub | Add entries to `catalog/services.json` |
| **2** | x402 Client (CLI) | **Complete** | Stellar Integration | Setup `STELLAR_SECRET_KEY` + `npm run cli -- fetch` |
| **3** | MCP / Agent Skill | **Complete** | Agent UX | Register MCP server in Cursor/Claude |
| **4** | Demo + Deploy + Pitch | **Docker + Docs** | Whole Team | Video demo + Railway deployment |

---

## Technical Features Implemented

| Component | Location | How to Test |
|------------|-----------|----------------|
| **Catalog API** | [`apps/catalog-api/server.mjs`](../apps/catalog-api/server.mjs) | `npm run catalog:dev` → `GET /services` |
| **Puma Hub UI** | [`apps/catalog-web/index.html`](../apps/catalog-web/index.html) | `npm run catalog:dev` → `http://127.0.0.1:3840/` |
| **Agent CLI** | [`apps/cli/bin/agenticx402.mjs`](../apps/cli/bin/agenticx402.mjs) | `npm run cli -- help` |
| **MCP Server** | [`apps/mcp/server.mjs`](../apps/mcp/server.mjs) | `npm run mcp` |
| **E2E Test Suite** | [`scripts/e2e-test.mjs`](../scripts/e2e-test.mjs) | `npm run test:e2e` |
| **Sponsored Onboarding** | [`apps/shared/trustline.mjs`](../apps/shared/trustline.mjs) | Use MCP tool `sponsor_agent_account` |

---

## Quick Links

- [Main README](../README.md)
- [CLI Guide](./cli.md)
- [MCP Documentation](./mcp.md)
- [Deploy Guide](./deploy.md)
- [Business Model](../BUSINESS_MODEL.md)
- [Stellar Knowledge Base](../skill/SKILL.md)
