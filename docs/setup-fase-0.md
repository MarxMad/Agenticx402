# Fase 0 — Setup local (checklist ejecutable)

Objetivo: tener **billetera en testnet**, **flujo x402 validado** contra un servicio real y el repo **listo** para enlazar el cliente del hub en la Fase 2.

## Decisiones por defecto del proyecto

- **Red:** `stellar:testnet` hasta nuevo aviso.
- **Activos:** priorizar **USDC** testnet donde el servicio lo permita; XLM según ejemplos oficiales.
- **Facilitator:** el documentado en [Built on Stellar — x402](https://developers.stellar.org/docs/build/agentic-payments/x402/built-on-stellar); no hospedar uno propio en el MVP salvo que el hackathon lo exija.

## 1. Cuenta y fondos (testnet)

1. Crear o importar cuenta en [Stellar Lab](https://developers.stellar.org/docs/tools/lab) o [Freighter](https://www.freighter.app/) (extension de escritorio; Freighter mobile no cubre x402 al cierre de esta guía).
2. Solicitar XLM testnet en el friendbot / faucet que indiquen las docs actuales.
3. Si el servicio cobra en **USDC testnet**, seguir la guía del [quickstart x402](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide) para obtener USDC de prueba.

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
# Ejemplo — nombres definitivos en Fase 2
STELLAR_NETWORK=TESTNET
STELLAR_SECRET_KEY=SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
# Opcional según SDK
STELLAR_PUBLIC_KEY=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Copia plantilla en `.env.example` cuando exista el paquete cliente (Fase 2).

## 5. Cierre de Fase 0

- [ ] Decisión de red y activos confirmada (o anotada en PR si cambia).
- [ ] x402-stellar o quickstart ejecutado al menos una vez con éxito.
- [ ] Al menos una llamada exitosa contra un servicio externo de prueba.
- [ ] `.env` local fuera de git; `.gitignore` verificado.
- [ ] Desde la raíz del repo: `npm run fase0:check` (valida catálogo y `cli list`; opcionalmente 402 si defines `X402_SMOKE_URL` y `STELLAR_SECRET_KEY`).
- [ ] Añade tu fila en la tabla **Fase 0** de [`docs/PROGRESS.md`](./PROGRESS.md) (fecha + nota sin secretos).

Siguiente paso (equipo): **Fase 1** ya está en el repo; sigue integración con hub según [`README.md`](../README.md).
