# Fase 0 — Setup local (checklist ejecutable)

Objetivo: tener **billetera en testnet**, **flujo x402 validado** contra un servicio real y el repo **listo** para enlazar el cliente del hub en la Fase 2.

## Decisiones por defecto del proyecto

- **Red:** `stellar:testnet` hasta nuevo aviso.
- **Activos:** priorizar **USDC** testnet donde el servicio lo permita; XLM según ejemplos oficiales.
- **Facilitator:** el documentado en [Built on Stellar — x402](https://developers.stellar.org/docs/build/agentic-payments/x402/built-on-stellar); no hospedar uno propio en el MVP salvo que el hackathon lo exija.

## 1. Cuenta y fondos (testnet)

### Opción A — Stellar CLI (recomendada en este repo)

Instala el CLI: [Stellar CLI — documentación](https://developers.stellar.org/docs/tools/cli) (apartado *Install*).

**zsh / pegar desde el chat:** en la terminal interactiva, `#` **no** es comentario por defecto. Si copias `stellar keys public-key pumax402-payto    # nota`, el CLI recibe `#` como argumento y responde `unexpected argument '#' found`. Ejecuta **solo** la parte del comando, o pon la nota en la **línea anterior**. Opcional: `setopt interactivecomments` para que `#` al final de línea se ignore.

1. **Usar testnet por defecto** (una vez por máquina):
   ```bash
   stellar network use testnet
   ```
2. **Nueva identidad + XLM testnet** — `--fund` pide fondos en la red de pruebas (no sirve para mainnet):
   ```bash
   stellar keys generate pumax402-fase0 --fund
   ```
   Para **Agent Pulse** conviene **dos identidades**: una **receptora** (`PUMA_X402_PAYTO`) y una **pagadora** (`STELLAR_SECRET_KEY`):
   ```bash
   stellar keys generate pumax402-payto --fund
   stellar keys generate pumax402-payer --fund
   ```
3. **Dirección pública (G…)** de la cuenta que recibirá pagos:
   ```bash
   stellar keys public-key pumax402-payto
   ```
   Ese valor es el candidato a `PUMA_X402_PAYTO` (con trustline USDC en esa cuenta).
4. **Clave secreta (S…)** de la cuenta que pagará en el CLI:
   ```bash
   stellar keys secret pumax402-payer
   ```
   Guárdala en `.env` como `STELLAR_SECRET_KEY=...`. No la subas al repo ni la muestres en capturas.
5. **USDC testnet:** el `--fund` del CLI cubre **XLM** de prueba. Los servicios x402 de este proyecto suelen cobrar en **USDC** testnet: abre trustline y consigue USDC de prueba siguiendo el [quickstart x402](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide) (receptor y pagador según lo que vayas a probar). Guía detallada para **agentes / LLMs** (de dónde sacar emisor y comando, MCP, `GET /`): [`agents-stellar-trustline.md`](./agents-stellar-trustline.md).

Si ya generaste la clave sin fondos: `stellar keys fund <NOMBRE> --network testnet`.

**Hecho cuando:** tienes XLM testnet en las identidades que uses y, si vas a pagar o cobrar en USDC, trustline + saldo USDC según el quickstart.

### Opción B — Stellar Lab o Freighter

1. Crear o importar cuenta en [Stellar Lab](https://developers.stellar.org/docs/tools/lab) o [Freighter](https://www.freighter.app/) (extensión de escritorio; Freighter mobile no cubre x402 al cierre de esta guía).
2. Solicitar XLM testnet en el friendbot / faucet que indiquen las docs actuales.
3. Si el servicio cobra en **USDC testnet**, seguir el mismo [quickstart x402](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide) para trustline y USDC de prueba.

**Hecho cuando:** puedes firmar una transacción Soroban de prueba en Lab o desde el ejemplo oficial.

## 2. Correr el ejemplo oficial (recomendado)

En una carpeta **hermana** de este repo (no hace falta submódulo):

```bash
git clone https://github.com/stellar/x402-stellar.git
cd x402-stellar
```

Seguir el README del monorepo y el [quickstart](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide): levantar servidor de demostración y cliente mínimo hasta ver **HTTP 402 → pago → 200**.

**Hecho cuando:** una llamada autenticada devuelve datos tras el pago.

## 3. Probar un servicio público

1. Abrir [xlm402.com](https://xlm402.com) y elegir un endpoint documentado.
2. Repetir el flujo con la herramienta que uses (curl + scripts del quickstart, o UI del demo).

**Hecho cuando:** has registrado en notas (o en un issue) qué endpoint usaste, asset, y un hash o captura de respuesta exitosa **sin exponer claves**.

## 4. Variables de entorno locales (para fases siguientes)

Crear `.env` en tu máquina (nunca commitear):

```bash
# Clave del pagador (p. ej. salida de: stellar keys secret pumax402-payer)
STELLAR_SECRET_KEY=SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
# testnet (default del cliente) | pubnet
# STELLAR_NETWORK=testnet

# Agent Pulse — cuenta que recibe (p. ej. stellar keys public-key pumax402-payto)
# PUMA_X402_PAYTO=G...
```

Plantilla alineada con el repo: [`.env.example`](../.env.example).

## 5. Cierre de Fase 0

- [ ] Decisión de red y activos confirmada (o anotada en PR si cambia).
- [ ] x402-stellar o quickstart ejecutado al menos una vez con éxito.
- [ ] Al menos una llamada exitosa contra un servicio externo de prueba.
- [ ] `.env` local fuera de git; `.gitignore` verificado.
- [ ] Desde la raíz del repo: `npm run fase0:check` (valida catálogo y `cli list`; opcionalmente 402 si defines `X402_SMOKE_URL` y `STELLAR_SECRET_KEY`).
- [ ] Añade tu fila en la tabla **Fase 0** de [`docs/PROGRESS.md`](./PROGRESS.md) (fecha + nota sin secretos).

Siguiente paso (equipo): **Fase 1** ya está en el repo; sigue integración con hub según [`README.md`](../README.md).
