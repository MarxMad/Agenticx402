# Avance del proyecto (para colaboradores)

Este archivo es la **fuente de verdad operativa**: qué fase toca, qué ya está en el repo y qué falta. Actualízalo al cerrar tareas o al abrir PRs relevantes.

**Última revisión del documento:** 2026-04-02

---

## Resumen por fases

| Fase | Nombre | Estado en repo | Responsable típico | Siguiente acción |
|------|--------|----------------|----------------------|------------------|
| **0** | Aterrizaje (wallet + x402 end-to-end local) | **Guía lista** — la ejecución es **por desarrollador** | Cada dev | Completar checklist en [`setup-fase-0.md`](./setup-fase-0.md) y anotar fecha en la tabla de abajo |
| **1** | Cimientos del hub (catálogo + API + UI) | **Completa** | Core hub | Añadir más entradas en `catalog/services.json` o mejorar UI si hace falta |
| **2** | Cliente x402 (CLI / librería) | Pendiente | Integración Stellar | Inicializar paquete `packages/cli` o similar con `x402-stellar` |
| **3** | MCP / skill para agentes | Pendiente | Agent UX | Servidor MCP mínimo que llame al CLI o a la API |
| **4** | Demo + deploy + pitch | Pendiente | Todo el equipo | Base en [`CONTRIBUTING.md`](../CONTRIBUTING.md); falta video, deploy público y pitch final |

**Leyenda de estado:** *Completa* = criterios de hecho del README cubiertos en código o docs del repo. *Guía lista* = el equipo debe ejecutar pasos fuera del repo (wallet, clone de x402-stellar).

---

## Fase 0 — Seguimiento local (obligatorio antes de integrar pagos reales)

Cada persona marca su fila cuando termine el checklist de [`setup-fase-0.md`](./setup-fase-0.md).

| Persona / alias | Fecha cierre Fase 0 | Nota (sin secretos) |
|-----------------|---------------------|----------------------|
| _Pendiente_ | | |

---

## Fase 1 — Qué hay implementado

| Componente | Ubicación | Cómo probarlo |
|------------|-----------|----------------|
| Datos del catálogo | [`catalog/services.json`](../catalog/services.json) | Editar y correr validación |
| Validación JSON | [`scripts/validate-catalog.mjs`](../scripts/validate-catalog.mjs) | `npm run catalog:validate` |
| API read-only | [`apps/catalog-api/server.mjs`](../apps/catalog-api/server.mjs) | `npm run catalog:dev` → `GET /services`, `GET /services/:id` |
| UI del hub | [`apps/catalog-web/index.html`](../apps/catalog-web/index.html) | Mismo servidor → abrir `http://127.0.0.1:3840/` |
| Cómo dar de alta servicios | [`catalog/README.md`](../catalog/README.md) | PR con cambios en `services.json` |

**Criterios de hecho Fase 1 (revisión):**

- [x] Modelo de datos documentado y semilla en JSON
- [x] API `GET /services` y `GET /services/:id`
- [x] Página que lista servicios con filtro por texto y por tag
- [x] Instrucciones de alta en `catalog/README.md`
- [x] Script de validación del catálogo

---

## Fase 2 en adelante — Orden de trabajo recomendado

1. **Fase 2:** definir interfaz del CLI (`call <service-id> --path …`), añadir `.env.example`, dependencia `x402-stellar`, documentar en README.
2. **Fase 3:** MCP que exponga `list_services` + `call_service` (puede leer catálogo vía `http://localhost:3840` o archivo).
3. **Fase 4:** deploy del servidor de catálogo (un solo proceso sirve API + UI), CONTRIBUTING ampliado, grabación de demo.

---

## Changelog breve (repo)

| Fecha | Cambio |
|-------|--------|
| 2026-04-02 | Fase 1 cerrada: UI en `/`, segundo servicio en catálogo (Stellar Observatory), `catalog:validate`, `CONTRIBUTING.md`, `PROGRESS.md` |

---

## Enlaces rápidos

- [README principal](../README.md) — visión y plan de fases
- [Modelo de negocio](../BUSINESS_MODEL.md)
- [Recursos Stellar / x402](./../docs.md)
- [Guía setup Fase 0](./setup-fase-0.md)
