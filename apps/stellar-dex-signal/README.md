# stellar-dex-signal (PumaX402)

API **x402 Exact** (Stellar) que expone señales del DEX vía **Horizon** (order book + trades recientes + snapshot de pools AMM).

## Variables

| Variable | Descripción |
|----------|-------------|
| `DEX_X402_PAYTO` | **Requerida.** Cuenta `G...` que recibe USDC (misma red que `STELLAR_NETWORK`). |
| `DEX_X402_PRICE` | Default `$0.05`. |
| `STELLAR_NETWORK` | `testnet` (default) o `pubnet`. |
| `STELLAR_HORIZON_URL` | Opcional; default testnet `https://horizon-testnet.stellar.org`, pubnet `https://horizon.stellar.org`. |
| `DEX_DEFAULT_BUYING_ISSUER` | Emisor del activo **buying** por defecto (ej. USDC en la red elegida). Necesario si no pasas `buying_issuer` en la query. |
| `DEX_CACHE_TTL_MS` | Default `45000`. Caché por clave para reducir presión a Horizon. |
| `PORT` | Default `3851`. |

## Ejecutar

```bash
export DEX_X402_PAYTO=G...
export DEX_DEFAULT_BUYING_ISSUER=G...   # emisor USDC testnet/public según red
npm run dex-signal
```

## Rutas

- `GET /` — meta (sin pago)
- `GET /health` — salud
- `GET /v1/signal` — pago x402. Query típica (XLM → USDC): sin params si `DEX_DEFAULT_BUYING_ISSUER` está definido; o `buying_issuer=...`
- `GET /v1/pools?limit=10` — pago x402; líquidez AMM reciente

## CLI (repo raíz)

```bash
npm run cli -- call pumax402-stellar-dex-signal --path "/v1/signal"
npm run cli -- call pumax402-stellar-dex-signal --path "/v1/pools?limit=5"
```

**Aviso:** no es asesoramiento financiero; datos públicos con latencia de Horizon.
