# Guía hackathon — jurado, Stellar/x402 y demo

Documento para **explicar el proyecto con claridad** y preparar **demo + URL pública** sin asumir que dominas Docker.

---

## 1. Qué problema resolvemos (30 segundos de pitch)

Hoy hay APIs que cobran **por petición** usando el estándar **HTTP 402** y pagos en cadena. Un agente (o un humano con scripts) se pierde entre **URLs distintas**, **formatos distintos** y **cómo firmar el pago** en cada una.

**PumaX402** aporta tres cosas concretas:

1. **Catálogo** — quién es el servicio, URL base, red (p. ej. Stellar testnet), tags, enlaces a docs (dato versionado + API + web).
2. **Cliente único** — CLI (y MCP) que hace el flujo **“pedir → si 402, pagar en Stellar → reintentar”** contra cualquier URL del catálogo o directa.
3. **Cara de agente** — MCP para que un LLM **liste** servicios y **llame** uno sin inventarse integraciones ad hoc.

No sustituimos al **facilitator** ni al **servidor x402** de cada proveedor: **orquestamos descubrimiento + cliente de pago** encima del ecosistema estándar.

---

## 2. Qué es Stellar aquí y qué es x402 (sin mezclar conceptos)

| Concepto | Rol en este proyecto |
|----------|----------------------|
| **Stellar** | Red donde se **liquidan** muchos flujos x402 en testnet/mainnet (activos como USDC/XLM, cuentas, firma). Nosotros **no** desplegamos contratos propios en el repo del hub. |
| **x402** | **Protocolo sobre HTTP**: el servidor responde **402 Payment Required** con un reto; el cliente **firma** y **reintenta** la misma URL con cabeceras de pago. Es el “idioma” de la paywall. |
| **Facilitator** | Servicio de red (p. ej. *Built on Stellar*) que **verifica y liquida** el pago que el cliente envió. Lo usan los **servicios remotos** que llamas; **nuestro catálogo no lo reemplaza**. |
| **@x402/core + @x402/stellar** (npm) | Librerías con las que el **CLI/MCP** construyen el cliente HTTP que entiende 402 y firma con **Exact Stellar** (esquema documentado en el ecosistema Stellar x402). |

**En una frase para el jurado:** *“PumaX402 es el directorio y el mando a distancia; Stellar + x402 son la capa de pago que ya estandarizáis; nosotros hacemos que agente y humano descubran y paguen igual.”*

---

## 3. Qué tecnologías usamos **realmente** en el código

| Pieza | Tecnología | Dónde |
|-------|------------|--------|
| Hub web + API catálogo | Node.js `http` (sin framework), HTML/JS | `apps/catalog-api/server.mjs`, `apps/catalog-web/` |
| Datos del catálogo | JSON versionado | `catalog/services.json` |
| Cliente x402 | `@x402/core`, `@x402/stellar` | `apps/cli/lib/x402-fetch.mjs` (y MCP importa lo mismo) |
| CLI | Node, `parseArgs` | `apps/cli/bin/agenticx402.mjs` |
| MCP | `@modelcontextprotocol/sdk`, `zod` | `apps/mcp/server.mjs` |
| Docker (opcional) | Imagen solo del hub | `Dockerfile` |

**Lo que no hay en el repo:** nuestro propio facilitator, nuestro smart contract de cobro, ni un SDK distinto del oficial x402/Stellar para el cliente.

---

## 4. URL pública: ¿Vercel? ¿Docker?

### ¿Vercel con este repo tal cual?

**No es la opción natural.** Vercel brilla en **estático + funciones serverless** con tiempo de ejecución limitado. Nuestro hub es un **proceso Node que escucha un puerto** (`server.listen`). Para usar Vercel habría que **reescribir** la API como *Serverless Functions* y la web como estático — se puede, pero es **otro trabajo**, no “subir y listo”.

### Sin Docker (recomendado si no lo usas)

Servicios que permiten **“Start command”** sobre un repo Node:

1. **[Render](https://render.com)** (Web Service) o **[Railway](https://railway.app)** o **[Fly.io](https://fly.io)**.
2. Conecta el repo **GitHub** `MarxMad/Agenticx402`.
3. **Build command:** vacío o `echo "no build"` (el servidor no necesita `npm install` para el hub).
4. **Start command:**  
   `node apps/catalog-api/server.mjs`
5. **Variable de entorno:** el proveedor suele asignar `PORT` solo; nuestro código ya hace `process.env.PORT || 3840`.
6. Abre la URL que te den: `/` = UI, `/services` = JSON, `/health` = comprobación.

Si te piden **versión de Node**, elige **20 o 22**.

### Con Docker

Solo si ya usas contenedores: `docker build` / `docker run` como en el [README](../README.md). Es equivalente a lo anterior pero empaquetado.

---

## 5. Cómo se ve el vídeo demo (guion visual, ~2–4 min)

Objetivo: que el jurado **vea** catálogo → cliente → (opcional) pago. Orden sugerido:

| Tiempo aprox. | Qué se ve en pantalla | Qué dices (idea) |
|---------------|------------------------|------------------|
| 0:00–0:20 | Slide o navegador con título **PumaX402** + logo/texto del hackathon | “Los agentes necesitan descubrir y pagar APIs por petición; x402 en Stellar ya existe; nosotros unificamos descubrimiento y cliente.” |
| 0:20–0:50 | **Hub web** (`/`): lista de servicios, filtro por texto o tag, clic en **Documentación** (`#docs`) un segundo | “Catálogo vivo: API REST, misma data para humanos y máquinas.” |
| 0:50–1:30 | **Terminal**: `npm run cli -- list` luego `npm run cli -- call <id> --path /algo` **o** **Cursor** invocando MCP `list_services` | “Un solo CLI y un MCP: el agente no integra cada API a mano.” |
| 1:30–2:30 *(opcional pero muy fuerte)* | Misma terminal: intento sin clave → mensaje 402; **cortar** o difuminar; luego con `STELLAR_SECRET_KEY` testnet, **respuesta 200** y JSON | “Aquí Stellar + x402: 402, firma, reintento. Testnet real del hackathon.” |
| 2:30–fin | Vuelta al **diagrama** del README (mermaid capturado) o esquema simple + URL del repo | “Código abierto: hub + cliente + MCP; facilitator y servicios siguen siendo el estándar del ecosistema.” |

**Consejos técnicos de grabación:** zoom 125–150 % en terminal y navegador; fuente grande; **no** grabar `STELLAR_SECRET_KEY`; si muestras `.env`, tapa o usa variable de entorno del sistema sin abrir el archivo.

---

## 6. Frases listas para Q&A del jurado

- **“¿En qué sois distintos de xlm402.com?”** — Ellos son **contenido/servicios de ejemplo**; nosotros somos **capa de descubrimiento + cliente reutilizable** sobre cualquier baseUrl que cumpla x402.
- **“¿Dónde está el facilitator?”** — En la **infra de los servicios que llamáis** (p. ej. Built on Stellar); nosotros **consumimos** el 402 que esos servicios emiten.
- **“¿Stellar dónde entra?”** — En la **firma y liquidación** del pago que `@x402/stellar` ejecuta cuando configuráis la clave testnet en el cliente.

---

## 7. Enlaces oficiales (para la presentación)

- **Hub en vivo (equipo):** [agenticx402-production.up.railway.app](https://agenticx402-production.up.railway.app/) · API catálogo: `/services`
- [x402 en Stellar (docs)](https://developers.stellar.org/docs/build/agentic-payments/x402)
- [Quickstart x402 Stellar](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide)
- [x402.org](https://www.x402.org/)
- Repo del equipo: [github.com/MarxMad/Agenticx402](https://github.com/MarxMad/Agenticx402)

---

*Actualiza [`PROGRESS.md`](./PROGRESS.md) con el enlace al vídeo cuando lo subas.*
