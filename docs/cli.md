# CLI `agenticx402` (Fase 2)

Cliente de línea de comandos que resuelve el flujo **HTTP 402 → firma Stellar (Exact) → reintento** usando [`@x402/core`](https://www.npmjs.com/package/@x402/core) y [`@x402/stellar`](https://www.npmjs.com/package/@x402/stellar).

## Instalación local

Desde la raíz del repo (tras `npm install`):

```bash
npm run cli -- list
```

O con bin global tras `npm link` (opcional):

```bash
agenticx402 list
```

## Variables de entorno

Ver [`.env.example`](../.env.example). Mínimo para pagar un 402:

- `STELLAR_SECRET_KEY` — clave `S...` de una cuenta con fondos en la red que exija el servicio (típicamente **testnet**).

Sin `STELLAR_SECRET_KEY`, `fetch` y `call` solo hacen una petición normal; si la respuesta es **402**, el CLI indica que falta la clave.

## Comandos

| Comando | Descripción |
|---------|-------------|
| `list` | Imprime servicios del catálogo (archivo local o `AGENTICX402_CATALOG_URL`). |
| `fetch <url>` | GET (o `--method`) a una URL completa. |
| `call <id> --path /ruta` | Construye URL con `baseUrl` del servicio `id` en el catálogo + `path`. |

## Probar un 402 real

1. Obtén USDC/XLM de testnet según [quickstart x402](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide).
2. Exporta `STELLAR_SECRET_KEY`.
3. Usa una URL documentada del proveedor (p. ej. un endpoint listado en [xlm402.com](https://xlm402.com)):

```bash
npm run cli -- fetch "https://…endpoint-documentado…"
```

Si el servidor exige **mainnet**, ajusta `STELLAR_NETWORK=pubnet` y una clave con fondos en mainnet (solo si sabes lo que haces).

## Depuración

- Respuestas no JSON se imprimen como texto.
- Código de salida distinto de 0 si el HTTP final no es 2xx.
