# MCP PumaX402 (Fase 3)

Servidor [Model Context Protocol](https://modelcontextprotocol.io) por **stdio** para que un LLM (Cursor, Claude Desktop, etc.) use el catálogo y llame servicios con el mismo flujo x402 que el CLI.

## Ubicación y ejecución

- Código: [`apps/mcp/server.mjs`](../apps/mcp/server.mjs)
- Local: `npm run mcp` (no imprime nada útil en terminal: habla JSON-RPC por stdin/stdout).
- Tras `npm link` en el repo: comando `pumax402-mcp`.

## Tools

| Tool | Uso |
|------|-----|
| `list_services` | Opcional `query` (texto): devuelve JSON con `version`, `networkDefault` y lista de servicios (id, name, baseUrl, tags, …). |
| `call_service` | `service_id` (del catálogo), `path` (ej. `/ruta`), opcional `method` (`GET` por defecto). Respuesta: `status`, `body`, `url`. |

## Variables de entorno

Las mismas que el CLI — ver [`.env.example`](../.env.example) y [`docs/cli.md`](./cli.md). Para pagar un 402 hace falta **`STELLAR_SECRET_KEY`** en el entorno del **proceso del servidor MCP** (no solo del chat).

## Cursor (ejemplo)

En ajustes MCP, servidor con:

- **command:** `node`
- **args:** `["/ruta/absoluta/al/repo/Agentix402/apps/mcp/server.mjs"]`
- **cwd:** raíz del repo (donde está `package.json`)

Sustituye `/ruta/absoluta/...` por tu clon.

## Pruebas rápidas

1. Catálogo por defecto: invoca `list_services` sin argumentos.
2. HTTP sin pago: `call_service` con un `path` que no devuelva 402.
3. 402: sin clave, la respuesta incluye `hint`; con `STELLAR_SECRET_KEY` testnet, debe reintentar como `npm run cli -- fetch`.
