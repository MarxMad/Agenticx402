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

## 5. Veinticinco ideas “fuera de la caja” (agentes + Stellar)

Brainstorming para el equipo: mezcla de **x402**, **Soroban**, **MPP**, **anchors**, **passkeys**, **patrocinio**, **ingesta** y **MCP** (inspirado en el ecosistema descrito en [`docs.md`](./docs.md) y recursos tipo [Stellar MCP](https://github.com/kalepail/stellar-mcp-server), [XDR MCP](https://github.com/stellar-experimental/mcp-stellar-xdr), [Smart Account Kit](https://github.com/kalepail/smart-account-kit)).  

> **Aviso:** varias ideas son **provocadoras a propósito** (ética, privacidad, gobernanza). Sirven para **diseño de producto y debate**, no como recomendación legal ni moral. Filtrad antes de implementar.

| # | Idea (resumen) | Stellar / stack | Por qué es “cool” o incómoda |
|---|----------------|-----------------|--------------------------------|
| 1 | **Mercado de “culpa” on-chain** | x402 + registro Soroban | Los agentes pagan por **registrar** una decisión (hash del prompt + resultado) como **prueba de trazabilidad**; abre el debate: ¿quién es responsable si el hash es manipulable? |
| 2 | **Latido o silencio (dead switch lúdico)** | Contrato Soroban + pagos periódicos testnet | Si un agente **deja de pagar** un micro-abono simbólico, un contrato **libera** un mensaje o rota una clave de demostración. Metáfora de dependencia del agente respecto a fondos. |
| 3 | **Subasta de “primer turno” entre agentes** | Soroban + x402 para entrar a la cola | Dos bots pujan en testnet por **orden de ejecución** en una cola HTTP; Stellar como **reloj** y **árbitro** de prioridad. |
| 4 | **Notaría de conversaciones (hash)** | Transacción con memo / evento Soroban | Tras x402, el servicio **ancla** un hash del transcript agente-usuario para **disputas** (“qué dijo el modelo”). Controversia: privacidad vs prueba. |
| 5 | **Impuesto simbólico al “brand” del modelo** | x402 con precio distinto por `User-Agent` declarado | Cobrar distinto si el cliente dice ser GPT vs Claude vs local — **discriminación por software**, útil solo como **experimento** de políticas de precio. |
| 6 | **“Verdad referenciada” (oráculo + paywall)** | x402 + lectura Reflector/oráculo | El agente paga por un **paquete de cotizaciones firmadas** en formato JSON para prompts de trading; riesgo: **sobreconfianza** en el oráculo. |
| 7 | **Cap humano residual** | x402 + bounty en testnet | Ciertas peticiones **exigen** un pase humano barato (crowd simulado) antes de que el agente reciba el dato; tensiona **automatización vs trabajo humano**. |
| 8 | **Canal MPP entre dos agentes** | MPP Session + Stellar | Dos agentes abren **canal de micropagos** para intercambiar **cuota de API** sin tocar cadena cada vez; narrativa **economía agente-a-agente**. |
| 9 | **Ramp “fantasma” (solo narrativa)** | Docs anchors + x402 | El agente paga un 402 que devuelve **solo** el siguiente paso SEP documentado (sin ejecutar ramp real); para **educar** sin custodia fiat en hackathon. |
| 10 | **Passkey como freno de oro** | Smart Account Kit + presupuesto | El humano **solo con WebAuthn** puede subir el tope diario de gasto del agente en Soroban; poderoso pero **punto único de fallo** si pierdes el passkey. |
| 11 | **x402 por cada decode XDR** | Encadenar [mcp-stellar-xdr](https://github.com/stellar-experimental/mcp-stellar-xdr) con tu paywall | Cada invocación “entender transacción” cuesta un microcent; idea **anti-abuso** y también **fricción** a la transparencia. |
| 12 | **Reputación quemable** | Token o contador Soroban | Los agentes **pagan para bajar** (o subir) una métrica pública de otro agente — diseño **tóxico por defecto**; solo interesante si mostráis el **riesgo de gamificación**. |
| 13 | **Logros “casi soulbound”** | NFT ligero Soroban tras N pagos x402 | Insignia **no transferible** de “completó 100 flujos 402 en testnet”; útil para **demo**, peligroso si se confunde con **identidad real**. |
| 14 | **Ingesta como producto** | Ingest SDK + x402 | Vendéis **stream filtrado** de eventos Soroban por tópico, empaquetado para RAG de agentes; Stellar como **API de historia** de pago. |
| 15 | **Tiempo bloqueado en ledger** | x402 + reveal en altura N | Pagas ahora; el contenido sensible (clave de demo, prompt) **solo se revela** al llegar un ledger; **commit–reveal** para agentes impacientes. |
| 16 | **Prueba de “trabajo útil” simulado** | Soroban verifica hash de tarea | El agente paga para que un contrato **valide** un hash de salida contra un checklist on-chain; frontera con **vibes de PoW** sin quemar planeta. |
| 17 | **Lista de amenazas para prompts (threat intel)** | x402 + JSON curado | Pagáis por **indicadores** (regex, temas) para que agentes **no ejecuten** ciertos patrones; controversia: **quién cura** la lista (censura vs seguridad). |
| 18 | **Divorcio de cartera entre personas agente** | Multisig / split Soroban | Dos “personas” de un mismo stack **parten** saldo testnet según reglas; metáfora de **governance** entre co-fundadores y bots. |
| 19 | **Mercado inverso: te pagan por inferir** | x402 invertido (tú eres el servicio) | Otro agente te paga en testnet para que **ejecutes** un sub-prompt; borde ético: **explotación** de cómputo barato — planteado como **laboratorio** de SLAs. |
| 20 | **Micropago como prueba anti-sybil** | x402 mínimo antes de API | Menos CAPTCHA, más **coste marginal**; excluye a agentes sin wallet — **fricción de inclusión** vs **anti-spam**. |
| 21 | **Will del agente (sucesión)** | Contrato + condiciones | Si no hay actividad N días, fondos testnet pasan a una **clave sucesora** declarada; útil para narrar **continuidad** de servicios autónomos. |
| 22 | **Blend / DeFindex tras paywall** | x402 + enlace a estrategia sólo lectura | Tras pagar, el agente recibe **ruta documentada** (no asesoramiento) de cómo leer APY en testnet; cuidado con **regulación** si suena a finanzas. |
| 23 | **Economic load balancer embebido** | Idea tipo [ELB](https://github.com/marcelosalloum/x402/tree/x402-hackathon) como **servicio** | Vuestro hub **elige** cadena/método de pago por coste; Stellar como **opción default** pero no única — historia **multi-red** desde PumaX402. |
| 24 | **Sponsorship como narrativa** | Patrón [sponsored account](https://github.com/oceans404/stellar-sponsored-agent-account) + vuestro catálogo | “El hub **patrocina** la primera transacción del agente” en testnet; política clara de **límites** para no convertiros en faucet infinito. |
| 25 | **MCP que cobra en cadena por tool** | MCP + x402 por invocación | Cada tool del servidor MCP tiene **precio dinámico** leído de Soroban; los agentes **ven** el coste antes de llamar — transparencia **radical** de coste marginal. |

**Cómo usar esta lista:** elegid **1–2** ideas para un **paper prototype** o demo testnet; en el pitch, explicad **qué problema ético o de mercado** exploráis, no solo la feature.

---

## 6. Cómo usar este documento en el hackathon

1. **Pitch:** “No competimos con xlm402.com en cantidad de endpoints; competimos en **X**” (elegid un hueco de la sección 4).
2. **Demo:** Un servicio **propio** + catálogo PumaX402 + CLI/MCP da la historia **completa** (descubrimiento + pago + dato).
3. **Honestidad:** Decid al jurado qué partes son **facilitator estándar**, qué es **vuestro código**, y qué es **referencia comunitaria**.

---

## 7. Enlaces internos del repo PumaX402

- Catálogo actual: [`catalog/services.json`](../catalog/services.json)
- Guía jurado / deploy / vídeo: [`hackathon-jurado.md`](./hackathon-jurado.md)
- Recursos ampliados (inglés, lista larga): [`docs.md`](./docs.md)
- Índice tipo llms de docs Stellar (local): [`llmstellar.txt`](./llmstellar.txt)

---

*Si añadís un servicio propio al catálogo, actualizad `services.json` y una línea en `docs/PROGRESS.md`.*
