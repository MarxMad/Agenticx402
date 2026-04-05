# PumaX402 Agent Pulse — servicio x402 propio

**Agent Pulse** es un endpoint de pago (**x402 Exact**, USDC **testnet**) que devuelve un **JSON estable** pensado para **system prompts** de agentes: último ledger cerrado vía Horizon, fees base, red, y *hints* anti-alucinación (“esto es testnet”, “no subas secretos a prompts”).

No compite con catálogos genéricos tipo xlm402: es **un solo producto** — *contexto de cadena empaquetado para LLMs*.

## Requisitos (testnet)

1. Cuenta Stellar **G…** que **reciba** el pago (`PUMA_X402_PAYTO`): trustline **USDC** testnet + algo de USDC (p. ej. [Circle Faucet](https://faucet.circle.com/)).
2. El **cliente** que llama (`npm run cli -- fetch` o MCP) usa `STELLAR_SECRET_KEY` con la cuenta que **paga**.

Ver también [README de @x402/stellar](https://www.npmjs.com/package/@x402/stellar) (sección testnet / trustline).

## Variables

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `PUMA_X402_PAYTO` | Sí | Dirección pública **G…** del vendedor (recibe USDC). |
| `PUMA_X402_PRICE` | No | Default `$0.001`. |
| `PORT` | No | Default `3850`. |
| `STELLAR_HORIZON_URL` | No | Default `https://horizon-testnet.stellar.org`. |

## Ejecutar

```bash
export PUMA_X402_PAYTO=G...
npm run puma-service
```

- `GET /` — metadatos (sin pago).
- `GET /health` — salud (sin pago).
- `GET /v1/pulse` — **402** sin pago; tras pago x402, JSON **pulse**.

Probar con CLI del repo:

```bash
export STELLAR_SECRET_KEY=S...
npm run cli -- fetch "http://127.0.0.1:3850/v1/pulse"
```

Tras desplegar, actualiza `baseUrl` de la entrada `pumax402-agent-pulse` en `catalog/services.json`.
