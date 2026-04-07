# geopolitical-risk (PumaX402)

Orquestador **x402**: el cliente paga **~$0.08 USDC** por una **señal de riesgo** agregada; el servidor paga **~$0.01** a [xlm402.com news](https://xlm402.com/services/news), agrega con heurística (sin LLM en MVP) y devuelve JSON estable para agentes.

## Variables

| Variable | Descripción |
|----------|-------------|
| `GEO_X402_PAYTO` | **Requerida.** Cuenta `G...` que recibe el pago del cliente final. |
| `GEO_UPSTREAM_SECRET_KEY` | **Requerida.** `S...` de una **cuenta caliente** con USDC + XLM en la misma red; paga el fetch a xlm402. Mantener saldo bajo. |
| `GEO_X402_PRICE` | Default `$0.08`. |
| `STELLAR_NETWORK` | `testnet` (default) o `pubnet`. Ajusta prefijo de rutas news (`/testnet/news/...` vs `/news/...`). |
| `XLM402_HOST` | Default `https://xlm402.com`. |
| `PORT` | Default `3852`. |

## Ejecutar

```bash
export GEO_X402_PAYTO=G...
export GEO_UPSTREAM_SECRET_KEY=S...
npm run geopolitical-risk
```

## Ruta principal

`GET /v1/risk?region=global` — regiones admitidas (aprox.): `global`, `americas`, `europe`, `middle-east`, `africa`, `asia-pacific`, `politics`, `economics`, `security`. Cada una se mapea a una categoría de news en xlm402.

## CLI

```bash
npm run cli -- call pumax402-geopolitical-risk --path "/v1/risk?region=middle-east"
```

(Con `STELLAR_SECRET_KEY` como cliente; el servidor usa `GEO_UPSTREAM_SECRET_KEY` para pagar a xlm402 internamente.)

## Modelo hub

Demuestra **arbitraje de datos**: compra barato (news), vende señal más cara (riesgo agregado). La respuesta incluye **titulares/recortes** agregados, no el texto completo de fuentes.
