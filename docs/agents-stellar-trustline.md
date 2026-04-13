# Trustline USDC (Stellar testnet) — guía para agentes que pagan x402

Los servicios de este ecosistema suelen liquidar en **USDC sobre Stellar testnet** (esquema x402 **Exact**). Una cuenta Stellar **no puede recibir ni enviar** ese USDC hasta tener una **trustline** (línea de confianza) al activo correcto: código **`USDC`** y **emisor** fijado por Circle en testnet.

Esta página es para **LLMs y operadores humanos**: el agente debe **guiar** al usuario con datos verificables, no inventar emisores.

---

## 1. De dónde sacar el emisor y el comando (sin adivinar)

| Fuente | Qué hacer | Cuándo usarla |
|--------|-----------|----------------|
| **Catálogo PumaX402** | En `list_services` (MCP) o en `catalog/services.json`, si el servicio tiene **`stellarPrerequisites`**, ahí vienen `trustlines[].issuer`, `line` y **`stellarCliChangeTrustTemplate`**. | Antes de pagar; no hace falta llamar al servicio. |
| **Agent Pulse** (`pumax402-agent-pulse`) | **`GET`** sobre la `baseUrl` del servicio, ruta **`/`** (sin pago). El JSON incluye **`trustlineOnboardingForAgents`** con el mismo emisor, texto para el usuario y comando CLI listo. | Cuando el servicio ya está levantado y quieres contexto actualizado + `payTo` en el texto. |
| **Referencias oficiales** | [Circle — USDC contract addresses](https://developers.circle.com/stablecoins/usdc-contract-addresses) → fila **Stellar Testnet**. | Auditoría o si el catálogo no trae el bloque. |

**Línea clásica** (formato Stellar CLI y muchas APIs): `USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`  
(Emisor testnet según Circle a fecha de documentación de este repo; si Circle lo cambia, prioriza su tabla y actualiza el catálogo / [`apps/lib/stellar-usdc-testnet.mjs`](../apps/lib/stellar-usdc-testnet.mjs).)

---

## 2. Quién debe abrir trustline

- **Cuenta pagadora:** la que firma el pago x402 (en PumaX402 suele mapearse a **`STELLAR_SECRET_KEY`** / identidad del cliente).
- **Cuenta receptora:** la que recibe el pago en el servicio (p. ej. **`PUMA_X402_PAYTO`** en Agent Pulse).

Muchos fallos de pago en testnet son **trustline ausente** o **saldo USDC cero** en la cuenta pagadora.

---

## 3. Terminal: Stellar CLI

1. Red testnet (una vez por máquina):

   ```bash
   stellar network use testnet
   ```

2. Abrir trustline sustituyendo **`<SOURCE>`** por el **alias** guardado con `stellar keys generate`, la **G…** o la **S…** de la cuenta que debe confiar en USDC:

   ```bash
   stellar tx new change-trust \
     --source <SOURCE> \
     --line USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
   ```

3. **zsh:** no pegues comentarios en la misma línea (`# …`). En zsh interactivo, `#` no siempre es comentario y el CLI puede recibir `#` como argumento. Ver [`setup-fase-0.md`](./setup-fase-0.md).

4. La cuenta necesita **XLM testnet** suficiente para la reserva de la nueva línea de confianza.

Documentación Stellar del comando: [tx new — change trust](https://developers.stellar.org/docs/build/guides/cli/tx-new#change-trust).

---

## 4. Alternativa: Stellar Lab

En [Stellar Lab](https://lab.stellar.org/) se puede construir una transacción con la operación **Change Trust**, mismo código `USDC` y mismo emisor. Útil si el usuario no usa CLI.

---

## 5. Después de la trustline: USDC de prueba

La trustline **solo autoriza** a tener el activo; no deposita USDC.

- [Faucet Circle (testnet)](https://faucet.circle.com/)
- [Quickstart x402 Stellar](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide)

---

## 6. Cómo debe actuar un agente (resumen para system prompt)

1. Si el usuario va a **pagar** un servicio x402 en Stellar testnet con USDC, comprobar si ya tiene trustline; si no, dar el **`line`** o el bloque del catálogo / `GET /` del servicio.
2. **No inventar** emisores: usar `stellarPrerequisites`, `trustlineOnboardingForAgents` o la tabla de Circle.
3. Recordar: las **claves S…** solo en entorno local (`.env`), nunca en el chat público ni en el repo.
4. Tras trustline + USDC, el usuario puede usar **`npm run cli -- fetch`** o **`call_service`** (MCP) con **`STELLAR_SECRET_KEY`** configurada.

---

## Enlaces internos del repo

- Setup wallet y Fase 0: [`setup-fase-0.md`](./setup-fase-0.md)
- CLI: [`cli.md`](./cli.md)
- MCP: [`mcp.md`](./mcp.md)
- Servicio Agent Pulse: [`apps/puma-service/README.md`](../apps/puma-service/README.md)
