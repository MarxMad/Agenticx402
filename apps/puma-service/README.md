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

## Cómo explicarlo (elevator pitch)

**Agent Pulse** vende, por micropago x402 en USDC testnet, un **snapshot de contexto de red Stellar** (ledger, fees, red) en JSON pensado para que un LLM no invente números de cadena. El cliente paga; tu cuenta `PUMA_X402_PAYTO` recibe el USDC (menos lo que cobre el facilitador/red en la práctica real).

## ¿Dónde está la “ganancia”?

- En **testnet** no hay ganancia en dinero real: es **demostración** y aprendizaje del flujo x402.
- En **producción** (mainnet, precio que definas, clientes reales), la ganancia es **cada pago** que liquida hacia `PUMA_X402_PAYTO` por cada llamada a `/v1/pulse` (u otros endpoints que añadas).

## ¿Los agentes llaman solos a tu API?

No por magia: hace falta un **cliente** que entienda x402 (402 + firma + reintento). Eso puede ser:

- La **CLI** de este repo (`npm run cli -- fetch <url>`),
- Un **MCP** configurado en Cursor/otro host con `STELLAR_SECRET_KEY` del pagador,
- O cualquier otro software que implemente el flujo x402.

Un “agente” en el sentido de chat solo llamará a tu API si la herramienta que usa (MCP, plugin, script) hace ese flujo por él.

## ¿Cómo se demuestra el servicio?

1. Arranca `npm run puma-service` con `PUMA_X402_PAYTO` configurado.
2. Desde otra terminal: `npm run cli -- fetch "http://127.0.0.1:3850/v1/pulse"` con `STELLAR_SECRET_KEY` del **pagador** (con USDC testnet).
3. Deberías ver primero el intercambio 402 y luego el JSON **pulse**. Opcional: revisar el movimiento en un explorador de Stellar testnet.

**No** es obligatorio desplegar “otro agente” aparte: con CLI o MCP basta para demostrar el pago y el consumo de la API.

## Checklist de variables (¿qué te falta?)

| Rol | Variable | Notas |
|-----|----------|--------|
| Servidor (vendedor) | `PUMA_X402_PAYTO` | Obligatoria. G… con trustline USDC testnet. |
| Servidor | `PUMA_X402_PRICE`, `PORT`, `STELLAR_HORIZON_URL` | Opcionales (hay defaults). |
| Cliente (pagador) | `STELLAR_SECRET_KEY` | La cuenta que **paga**; debe tener USDC testnet. |
| Cliente | `STELLAR_NETWORK` | Solo si no usas testnet por defecto. |

Si el servicio arranca pero el fetch falla, casi siempre falta **trustline/saldo USDC** en el pagador o en `PAYTO`, o no está definida `PUMA_X402_PAYTO` / `STELLAR_SECRET_KEY` en el proceso correcto.
