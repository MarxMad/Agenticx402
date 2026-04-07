Agents on Stellar
Agents are one of the biggest stories in tech right now, but most agents still run into the same hard stop: payments. They can reason, plan, and act — right up until they need to pay for an API call, unlock a tool, access premium data, or complete a paid task. That’s what makes this moment so interesting on Stellar. With x402 on Stellar, builders can turn ordinary HTTP requests into paid interactions using stablecoin micropayments and Soroban authorization, letting apps, services, and agents transact natively on the web.

This hackathon is about exploring what happens when agents don’t just talk — they can buy, sell, coordinate, and earn. Think agent-to-agent services, paid tools, autonomous research workflows, machine-run marketplaces, onchain paywalls, or APIs that monetize every useful call instead of hiding behind subscriptions and API keys. Machine Payments Protocol (MPP) is also pushing this frontier forward with machine-to-machine payment flows built for paid resources, microtransactions, and programmable access, and Stellar builders can also explore the experimental stellar-mpp-sdk for MPP-style flows on Stellar.

Stellar is a particularly strong place to build for this shift. It gives developers fast settlement, very low transaction costs, strong stablecoin infrastructure, and programmable guardrails through contract accounts and spending policies. In other words: the rails are finally here for software that can act economically, not just conversationally. The opportunity in this hackathon is to build the kinds of products that feel obvious in hindsight — apps, agents, and services that make the internet more programmable, more open, and more native to payments.

3-Minute Hackathon Primer
Watch this short 3-minute video from James Bachini to quickly get up to speed on the hackathon.



Resources
We have a lot of resources to help you during this hackathon. Visit the Resources tab.

Submission Requirements
Open-source repo A public GitHub or GitLab repository containing the full source code and a clear README.md explaining the project. The more detail you include, the better. Didn’t finish a feature? Used mock data in places? Document it in the README.
Video demo A 2–3 minute video walkthrough of your project. It doesn’t need to be overly technical, but it should clearly show what you built and explain the work you did.
Stellar testnet/mainnet interaction Your project must submit, consume, or otherwise integrate real Stellar testnet or mainnet transactions.
Inspiration & Ideas
Need a spark? Check out the Ideas & Inspiration tab.

$10,000 Prize Pool
This hackathon features a single open innovation track with awards for the top projects:

First Place: $5,000 in XLM
Second Place: $2,000 in XLM
Third Place: $1,250 in XLM
Fourth Place: $1,000 in XLM
Fifth Place: $750 in XLM
Key Dates
Submissions Open: March 30, 2026
Submission deadline: April 13, 2026
Hackathon Support
The team is here to help you every step of the way. Feel free to drop in any of the following channels for assistance:

Stellar Hacks Telegram Group
Stellar Dev Discord
Note: Please beware of scams via DM on both platforms.

---

# PumaX402 y el hackathon — lectura del brief

El bloque siguiente resume texto oficial del reto; más abajo, **qué valor presentar para competir** y cómo lo cubre este repo.

---

## Qué buscan exactamente (resumen para el equipo)

| Lo que dicen | Traducción práctica |
|--------------|---------------------|
| Agentes que **pagan** por API, datos, herramientas | No basta con “chat”; hay que mostrar **flujo de pago** ligado a acción (HTTP 402 → firma → acceso). |
| **x402 en Stellar** | Micropagos en stablecoin + **autorización Soroban** (auth entries) en el cliente; los “rieles” son Stellar. |
| También **MPP** | Opción extra (pagos máquina-máquina distintos al 402 HTTP); **no sustituye** x402; ampliar el pitch solo si lo usáis de verdad. |
| “Buy, sell, coordinate, earn” | Productos donde el software **transacciona**: paywalls on-chain, marketplaces de llamadas, agente-a-agente, investigación autónoma pagada. |
| **Requisito duro de entrega** | Repo abierto + README claro + **vídeo 2–3 min** + **interacción real con testnet o mainnet** (transacciones Stellar reales). |

**Lo que más peso tiene para el jurado:** que en el **vídeo** y el README se **vea** Stellar (explorer, firma, testnet USDC/XLM, o log inequívoco post-402). Un catálogo bonito **sin** demostrar transacción real **no cumple** el criterio explícito de la convocatoria.

---

## Valor para **competir** (qué premian y qué aportamos)

El brief no premia “otro chat”: premia **software que transacciona** en Stellar y una historia **obvia después de verla**. PumaX402 compite bien si comunicáis **tres capas** en este orden (de la más diferencial al soporte):

| Capa | Qué valora el jurado | Qué mostráis en repo/demo |
|------|----------------------|---------------------------|
| **1. Servicios x402 propios** | “Construyen **producto** que cobra por llamada en la red.” | **Stellar DEX Signal** (Horizon → señal útil para agentes), **Geopolitical Risk** (orquestación + agregación con pago upstream), **Agent Pulse** (contexto testnet barato para prompts). Cada uno: 402 → firma → JSON útil. |
| **2. Cliente agente-first** | “El agente **no** reimplementa el flujo 402 a mano.” | **MCP** (`list_services`, `call_service`) + **CLI** (`doctor`, `call`, `fetch`) con `@x402/stellar`: 402 → pago → reintento según el estándar. |
| **3. Descubrimiento** | “Hay **mercado** / directorio, no solo un script suelto.” | **Hub** público + `catalog/services.json` + `GET /services`: ver qué existe antes de pagar. |

**Frase ganadora (~30 s):** *“Tres APIs nuestras cobran en Stellar por petición; el agente las **descubre** en el hub y las **paga** con un solo cliente (MCP/CLI) — misma lógica de pago para todas.”*

**Qué no debe ser el único argumento:** una lista bonita de enlaces a terceros. Eso es **complemento** del catálogo (`source: external`), no el núcleo para puntos altos.

**Checklist antes de enviar:**

1. **Vídeo:** al menos un `call` (CLI o MCP) donde se **cierre** un 402 contra un servicio **propio** y se vea 200 + cuerpo (ideal: hash o explorer testnet en pantalla o mencionado).  
2. **README:** deja claro al inicio **APIs propias** vs plataforma (el repo en inglés ya acentúa *first-party APIs*).  
3. **Una historia:** elegid un hilo (p. ej. agente de trading → DEX Signal *o* agente de riesgo → Geopolitical Risk) y ceñíos a esa demo; el jurado suele recordar **una** narrativa, no diez features sueltas.

---

## Cómo encaja **PumaX402**

| Expectativa del hackathon | Dónde lo cubre PumaX402 |
|---------------------------|-------------------------|
| Agentes / herramientas que pagan | **CLI** y **MCP** (`call_service`, `fetch`) con `@x402/stellar` + `STELLAR_SECRET_KEY` → **transacciones Stellar** en testnet cuando el endpoint exige 402. |
| Descubrimiento + economía | **Hub** (catálogo + API + web + `#docs`): qué APIs existen y cómo llamarlas con **un** contrato mental. |
| APIs que monetizan por llamada | **Servicios propios:** DEX Signal, Geopolitical Risk, Agent Pulse (x402 Exact). Referencias externas en catálogo para contexto/benchmark. |
| Open + README | Repo + docs (`hackathon-jurado.md`, `detailshackathon.md`, `x402-stellar-panorama.md`, PROGRESS). |

**Encaje narrativo fuerte:** *“**APIs que monetizamos nosotros** en Stellar; el agente las **encuentra** en el hub y **paga** igual con CLI/MCP.”*

---

## Riesgos y ajustes de foco (honestos)

1. **Riesgo principal:** Si la demo solo muestra **lista/filtros** del hub y no un **402 → éxito con firma testnet**, el requisito *“real Stellar testnet/mainnet transactions”* queda **débil**. **Mitigación:** en el vídeo, **obligatorio** un clip de terminal o Cursor donde, con testnet, se complete un pago y se vea respuesta OK (y si podéis, enlace a explorer o hash en README).  
2. **Segundo mensaje del brief:** “Obvious in hindsight” — reforzad **una historia** (p. ej. “desde el LLM al primer 402 pagado en 60 s”) más que muchas features sueltas.  
3. **MPP:** Solo vale la pena **cambiar el foco** hacia MPP si vais a **implementar** un flujo MPP real; si no, mantened **x402 HTTP** como historia principal y citad MPP como “frontera vecina” en una frase.  
4. **Servicio propio:** El brief premia **productos que transaccionan**. Un **endpoint x402 propio** (aunque sea mínimo) + hub + cliente refuerza “marketplace / paywall” más que solo enlazar a terceros.

---

## Conclusión

- **El valor competitivo** no es “ahorramos un paso” genérico: es **APIs propias pagadas en Stellar** + **cliente unificado para agentes** + **hub** que hace creíble la historia de “mercado de capacidades”.  
- **Sin vídeo con 402 → éxito testnet**, el requisito de interacción real queda débil aunque el resto esté pulido.  
- **Servicios propios listos para demo:** **Agent Pulse** (`npm run puma-service`), **DEX Signal** (`npm run dex-signal`), **Geopolitical Risk** (`npm run geopolitical-risk`) — entradas `pumax402-*` en [`catalog/services.json`](../catalog/services.json).

*Fechas del doc: apertura 30 mar 2026, entrega **13 abr 2026** — comprobad en la web oficial por si hay cambios.*