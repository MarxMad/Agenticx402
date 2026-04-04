# Panorama x402 en Stellar y opciones de innovación

Documento de referencia para el equipo: **qué ya existe** (servicios, demos, herramientas) y **dónde podría ir algo nuevo** sin repetir el mismo relato.

> **Nota:** el ecosistema cambia rápido. Las URLs y proyectos listados son los que suelen citarse en documentación oficial y recursos comunitarios a fecha de elaboración de este archivo. Comprueba siempre el estado actual en cada repositorio o sitio.

---

## 1. Qué es “un servicio x402” en este contexto

En Stellar, lo habitual es: un **endpoint HTTP** que, sin pago válido, responde **402 Payment Required** con un reto; el cliente **firma** (esquema *Exact* u otro soportado) y **reintenta**; un **facilitator** en la red valida/liquida el pago. Lo que cuenta como “servicio” aquí es algo **que un agente o un script puede llamar** tras pagar por petición.

*(MPP u otros protocolos de “machine payments” en Stellar existen en paralelo; no son x402 estricto — los mencionamos al final como vecinos del ecosistema.)*

---

## 2. Servicios y demos públicos x402 (Stellar) — ya existentes

### 2.1 Plataformas con varios endpoints o catálogo de prueba

| Qué es | Enlace | Comentario breve |
|--------|--------|------------------|
| **xlm402.com** | [https://xlm402.com](https://xlm402.com) | Referencia muy usada en hackathons: **varios endpoints** de prueba en testnet, documentación abierta, buen lugar para aprender el flujo 402 end-to-end. |
| **Demo oficial Stellar (x402)** | [https://stellar.org/x402-demo](https://stellar.org/x402-demo) | Demo **en vivo** del flujo x402 en Stellar (testnet/mainnet según configuración). Sirve para mostrar el protocolo sin montar servidor propio. |

### 2.2 Aplicaciones / productos concretos con paywall x402

| Qué es | Enlace | Comentario breve |
|--------|--------|------------------|
| **Stellar Observatory** | App: [stellar-observatory.vercel.app](https://stellar-observatory.vercel.app) · Repo: [github.com/elliotfriend/stellar-observatory](https://github.com/elliotfriend/stellar-observatory) | Datos de “space weather” y APIs con **x402**; el repo incluye **MCP**. Ejemplo de producto vertical (no genérico). |
| **Stellar Sponsored Agent Account** | [github.com/oceans404/stellar-sponsored-agent-account](https://github.com/oceans404/stellar-sponsored-agent-account) | Enfoque en **cuenta patrocinada** para agentes (USDC, sin XLM inicial en algunos flujos). Skill en Render enlazado desde el README del proyecto. |
| **1-shot Stellar — x402 app (video paywall)** | [github.com/oceans404/1-shot-stellar/tree/main/x402-app](https://github.com/oceans404/1-shot-stellar/tree/main/x402-app) | Ejemplo de **paywall** (p. ej. vídeo) con guía; buena referencia de patrón de producto. |
| **Economic Load Balancer (multi-chain x402)** | Rama hackathon en el ecosistema x402: [github.com/marcelosalloum/x402 (rama x402-hackathon)](https://github.com/marcelosalloum/x402/tree/x402-hackathon) | Enrutado **multi-cadena** eligiendo red más barata para micropagos de agentes; innovación en **capa de routing**, no en un solo endpoint Stellar. |

### 2.3 Herramientas para agentes (MCP / cliente) sobre x402 Stellar

| Qué es | Enlace | Comentario breve |
|--------|--------|------------------|
| **x402-mcp-stellar** | [github.com/jamesbachini/x402-mcp-stellar](https://github.com/jamesbachini/x402-mcp-stellar) | **Servidor MCP** para que clientes tipo Claude paguen servicios x402 en Stellar testnet/mainnet. |
| **x402-Stellar-Demo (minimal)** | [github.com/jamesbachini/x402-Stellar-Demo](https://github.com/jamesbachini/x402-Stellar-Demo) | Demo **local** Express + cliente pagador + facilitator; ideal para entender el circuito completo en código. |

### 2.4 Código de referencia oficial (plantillas, no “API pública” de producto)

| Qué es | Enlace | Comentario breve |
|--------|--------|------------------|
| **Repositorio stellar/x402-stellar** | [github.com/stellar/x402-stellar](https://github.com/stellar/x402-stellar) | Monorepo oficial: **facilitator**, demos tipo **simple-paywall**, configuración de despliegue, ejemplos. Base para construir **tu** servidor. |
| **Quickstart (docs)** | [developers.stellar.org — x402 quickstart](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide) | Tutorial paso a paso servidor + cliente + testnet. |
| **Plantilla fullstack (wallet navegador)** | [Ejemplo en ElliotFriend/x402 (stellar-browser-wallet-example)](https://github.com/ElliotFriend/x402/tree/stellar-browser-wallet-example/examples/typescript/fullstack/browser-wallet-example) | Scaffolding **frontend + paywall** micropagos. |

### 2.5 Infraestructura compartida (no es “tu competidor” de producto)

| Qué es | Enlace |
|--------|--------|
| **Facilitator “Built on Stellar”** | [Documentación](https://developers.stellar.org/docs/build/agentic-payments/x402/built-on-stellar) |
| **Redes soportadas (x402.org)** | [https://www.x402.org/facilitator/supported](https://www.x402.org/facilitator/supported) |
| **Relayer / plugin OpenZeppelin (facilitator propio)** | [Guía](https://docs.openzeppelin.com/relayer/1.4.x/guides/stellar-x402-facilitator-guide) |

---

## 3. Vecinos del ecosistema (Stellar “agentic payments”, no x402 HTTP)

Útiles para no confundir el pitch del jurado:

| Qué es | Enlace | Diferencia respecto a x402 HTTP |
|--------|--------|----------------------------------|
| **MPP** (Stripe + Stellar) | [Docs MPP](https://developers.stellar.org/docs/build/agentic-payments/mpp) | Otro modelo de pago máquina-máquina (intenciones Charge/Session, canales, etc.). |
| **Demo MPP** | [mpp.stellar.buzz](https://mpp.stellar.buzz) | Cobro por request en testnet vía MPP, no el flujo 402+x402 documentado arriba. |

---

## 4. Opciones de cosas **nuevas** e innovadoras (direcciones de diseño)

La innovación puede ser **producto**, **plataforma** o **experiencia de agente**. Abajo, ideas **deliberadamente distintas** de “otro endpoint genérico en xlm402”.

### 4.1 Capa hub / orquestación (cerca de lo que ya hacéis con PumaX402)

| Idea | Por qué puede ser innovador | Riesgo |
|------|----------------------------|--------|
| **Catálogo con “confianza”** | Scores por uptime, versión de esquema x402, último pago verificado (sin ser oracle perfecto). | Hay que definir métricas honestas para no prometer auditoría falsa. |
| **Presupuesto por agente** | CLI/MCP que **limita gasto diario** en USDC testnet antes de llamar al siguiente 402. | UX y estado local o servidor ligero. |
| **Contrato mental único para “skills”** | Describir cada servicio como **tool schema** (OpenAPI mínimo + precio) exportable a MCP automáticamente. | Mantenimiento del mapeo. |

### 4.2 Un servicio vertical propio (un solo producto x402 claro)

| Idea | Por qué puede ser innovador | Riesgo |
|------|----------------------------|--------|
| **“Stellar chain snapshot para prompts”** | Un JSON mínimo (último ledger, fees, red) **tras 402**, optimizado para que el LLM **no alucine** estado de red. | Debe aportar valor vs leer RPC gratis sin pago (el pitch es calidad + formato agente). |
| **Verificación de dirección / contrato** | Endpoint que valida formato, red y tipo (C…, G…) y devuelve JSON estructurado para pipelines de agentes. | Competencia con utilidades gratuitas → hay que empaquetar **contrato estable + logs + SLA testnet**. |
| **Feed “solo para agentes”** | JSON de eventos del hackathon, deadlines, enlaces oficiales — **contenido vivo** con micropago simbólico. | Si es estático, el jurado puede verlo flojo; conviene **actualizarlo** durante la demo. |
| **Lectura Soroban acotada** | Un **read** documentado (un contrato demo o estado público) detrás de 402; narrativa **Stellar nativa**. | Más tiempo de implementación y dependencia de contrato/RPC. |

### 4.3 Privacidad, identidad y límites (más “researchy”)

| Idea | Por qué puede ser innovador | Riesgo |
|------|----------------------------|--------|
| **Rate limit on-chain ligero** | Idea: acoplar pago 402 a un **contador** o política publicada (aunque sea testnet). | Diseño cuidadoso para no comprometer seguridad ni prometer lo que el contrato no hace. |
| **Delegación firmada** | Flujo donde un humano aprueba un **presupuesto** y el agente opera dentro de ese marco (documentado + demo). | Complejidad legal/producto; para hackathon mejor **mock** claramente etiquetado. |

### 4.4 Composición con el resto del stack Stellar

| Idea | Por qué puede ser innovador | Riesgo |
|------|----------------------------|--------|
| **x402 + anchor / ramp (testnet)** | Demostrar un flujo “agente paga API” y **enlazar** documentación hacia ramp fiat solo como narrativa (aunque el paso fiat sea manual en demo). | No mezclar MPP/x402 sin explicar bien al jurado. |
| **x402 delante de oráculo / Reflector** | Micropago por **cotización** o dato firmado para agentes de trading simulado en testnet. | Dependencia de APIs y límites de uso. |

---

## 5. Cómo usar este documento en el hackathon

1. **Pitch:** “No competimos con xlm402.com en cantidad de endpoints; competimos en **X**” (elegid un hueco de la sección 4).
2. **Demo:** Un servicio **propio** + catálogo PumaX402 + CLI/MCP da la historia **completa** (descubrimiento + pago + dato).
3. **Honestidad:** Decid al jurado qué partes son **facilitator estándar**, qué es **vuestro código**, y qué es **referencia comunitaria**.

---

## 6. Enlaces internos del repo PumaX402

- Catálogo actual: [`catalog/services.json`](../catalog/services.json)
- Guía jurado / deploy / vídeo: [`hackathon-jurado.md`](./hackathon-jurado.md)
- Recursos ampliados (inglés, lista larga): [`docs.md`](../docs.md)

---

*Si añadís un servicio propio al catálogo, actualizad `services.json` y una línea en `docs/PROGRESS.md`.*
