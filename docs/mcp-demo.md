# Demo MCP (Fase 3) — configuración reproducible

Objetivo: que cualquier miembro del equipo repita **list_services** → **call_service** con el mismo servidor stdio que el CLI usa para x402.

## Prerrequisitos

- Node **≥ 20** en la máquina donde corre Cursor (o Claude Desktop).
- Repo clonado; `npm install` en la raíz (genera `node_modules` para el SDK MCP).
- Para rutas con **402**: `STELLAR_SECRET_KEY` (testnet) en el entorno del **proceso MCP** (ver abajo).

## Cursor — MCP (JSON)

En **Cursor Settings → MCP** puedes añadir un servidor. Ejemplo usando ruta **absoluta** en Linux/WSL (ajusta al clon real):

```json
{
  "mcpServers": {
    "pumax402": {
      "command": "node",
      "args": ["/home/TU_USUARIO/Agenticx402/apps/mcp/server.mjs"],
      "cwd": "/home/TU_USUARIO/Agenticx402",
      "env": {
        "STELLAR_SECRET_KEY": ""
      }
    }
  }
}
```

- **Importante:** no commitees claves. En la práctica, deja `STELLAR_SECRET_KEY` vacío en el JSON y exporta la variable en el shell desde el que lanzas Cursor, o usa la UI de Cursor para variables sensibles si tu versión lo permite.
- **`cwd`:** debe ser la raíz del repo (donde está [`package.json`](../package.json)).
- **Catálogo remoto:** si el hub está desplegado, añade en `env`:

  `"AGENTICX402_CATALOG_URL": "https://TU-DOMINIO/services"`

## Flujo de demo (guion para vídeo o jurado)

1. Abrir el chat con el agente y el servidor **pumax402** habilitado.
2. Pedir: “Lista los servicios del catálogo PumaX402” → el modelo debe usar tool **list_services** (opcionalmente con `query` para filtrar).
3. Pedir una llamada sin pago, si existe, o contra **Agent Pulse** local:
   - Terminal 1: `export PUMA_X402_PAYTO=G…` y `npm run puma-service`
   - En el agente: **call_service** con `service_id` `pumax402-agent-pulse`, `path` `/v1/pulse`, `method` `GET`
4. Sin `STELLAR_SECRET_KEY`, una respuesta 402 debe devolver el hint en el cuerpo de la tool; con clave testnet, debe obtenerse **200** y JSON de pulse.

## Inspector MCP (sin Cursor)

Para depurar el servidor sin el IDE:

```bash
npx @modelcontextprotocol/inspector node /ruta/al/repo/apps/mcp/server.mjs
```

(Asegúrate de tener el `cwd` o `NODE_PATH` adecuado; lo más simple es ejecutar desde la raíz del repo.)

## Referencias

- Detalle de tools: [`docs/mcp.md`](./mcp.md)
- CLI equivalente: [`docs/cli.md`](./cli.md)
