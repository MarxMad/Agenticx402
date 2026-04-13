# Deploy del hub (Fase 4)

El hub es **API + UI estática** servidas por [`apps/catalog-api/server.mjs`](../apps/catalog-api/server.mjs). La imagen oficial solo incluye catálogo + ese servidor ([`Dockerfile`](../Dockerfile)).

## Hub público actual (equipo)

| | URL |
|--|-----|
| **UI** | [https://agenticx402-production.up.railway.app/](https://agenticx402-production.up.railway.app/) |
| **Catálogo JSON** | `https://agenticx402-production.up.railway.app/services` |
| **Salud** | `https://agenticx402-production.up.railway.app/health` |

Variable para CLI / MCP: `AGENTICX402_CATALOG_URL=https://agenticx402-production.up.railway.app/services`

Si migráis de dominio, actualizad esta sección y los ejemplos del README.

## Variables

| Variable | Uso |
|----------|-----|
| `PORT` | Puerto HTTP (ej. `8080`). Fly/Railway/Render suelen inyectarlo. |
| `NODE_ENV` | `production` en nube. |

Tras desplegar, la URL pública del catálogo JSON incluye el path **`/services`**. Ejemplo (este repo):

```bash
export AGENTICX402_CATALOG_URL=https://agenticx402-production.up.railway.app/services
npm run cli -- list
```

La variable debe ser la URL **completa** hasta `/services`. En local: `http://127.0.0.1:3840/services` (tras `npm run catalog:dev`).

## Opción A — Docker (Fly.io, Railway, Render, etc.)

Build en local o en CI:

```bash
docker build -t pumax402-hub .
docker run --rm -p 8080:8080 -e PORT=8080 pumax402-hub
```

En el panel del proveedor:

1. Conecta el repo o sube la imagen.
2. Expón el puerto igual a `PORT`.
3. Anota la URL HTTPS pública.

**Checklist:** `GET /health` → JSON; `GET /services` → catálogo; `GET /` → UI.

## Opción B — Node directo (buildpack)

Si el proveedor ejecuta Node sin Docker:

- **Start command:** `node apps/catalog-api/server.mjs`
- **Root directory:** raíz del repo (necesitas copiar `catalog/`, `apps/catalog-api/`, `apps/catalog-web/`; el Dockerfile es la referencia de qué copiar).

Instalar dependencias **no** es obligatorio para solo el hub si copias solo esas carpetas: el `server.mjs` usa módulos nativos y `fs` para servir estáticos. Revisa que el servidor no importe paquetes no instalados — en este repo el catalog-api debe ser autocontenido; si añades deps, incluye `npm ci` en el build.

## Después del deploy

1. Actualiza [`docs/PROGRESS.md`](./PROGRESS.md) con la URL pública (sin secretos).
2. Opcional: añade una entrada o `baseUrl` de demo en [`catalog/services.json`](../catalog/services.json) si expones el hub como servicio descubrible.
3. En documentación del hackathon, enlaza `AGENTICX402_CATALOG_URL` para quien reproduzca la demo.

## Nota Vercel

Server Express con rutas dinámicas a archivos locales suele encajar mejor en **Railway, Fly o Render** que en Vercel serverless “puro”. Si usas Vercel, confirma que el runtime sea Node de larga duración o adapta el hub a su modelo. Ver también [`docs/hackathon-jurado.md`](./hackathon-jurado.md).
