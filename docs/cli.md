# CLI PumaX402 (Fase 2)

Cliente de línea de comandos que resuelve el flujo **HTTP 402 → firma Stellar (Exact) → reintento** usando [`@x402/core`](https://www.npmjs.com/package/@x402/core) y [`@x402/stellar`](https://www.npmjs.com/package/@x402/stellar).

## Qué necesitas para usarlo bien

| Requisito | Detalle |
|-----------|---------|
| **Node.js** | **20 o superior** (`node -v`). El repo declara `engines.node >=20`. |
| **Dependencias** | En la raíz del repo: `npm install`. |
| **Catálogo** | Por defecto se lee `catalog/services.json` **desde el clon del repo**. Si ejecutas el bin desde otra carpeta o sin ese archivo, define **`AGENTICX402_CATALOG_URL`** (URL de un hub, p. ej. `…/services`) o **`AGENTICX402_CATALOG_FILE`** (ruta absoluta a un `services.json`). |
| **Variables** | Opcional: archivo **`.env`** en la raíz del repo (se carga solo al arrancar el CLI/MCP), o **`AGENTICX402_ENV_FILE`** apuntando a un `.env` concreto. |
| **Pagar un 402** | **`STELLAR_SECRET_KEY`**: clave secreta `S…` de una cuenta con **XLM** (fees) en la red que use el servicio (**testnet** por defecto). Sin ella, `fetch`/`call` hacen una petición normal y, si hay 402, el CLI indica que falta la clave. |
| **USDC en testnet** | Suele hacer falta **trustline** al emisor de USDC antes de que el pago Exact funcione. Guía: [`agents-stellar-trustline.md`](./agents-stellar-trustline.md). |
| **Red** | **`STELLAR_NETWORK`**: `testnet` (por defecto) o `pubnet` si el servicio es mainnet. |

**Primera vez:** ejecuta **`npm run cli -- doctor`** (o `agenticx402 doctor` si tienes el bin enlazado) para comprobar Node, variables, acceso al catálogo y ver recordatorios de trustline.

## Instalación local

Desde la raíz del repo (tras `npm install`):

```bash
npm run cli -- list
```

O con bin global tras `npm link` (opcional):

```bash
agenticx402 list
```

## Identidad en terminal (banner)

Cartel **PUMAX402** en **bloques pixel** (`█`) con **sombra** (`▒`). Parte de los bloques van en **azul tenue** (`94` atenuado); el resto en **blanco**. **No se pinta el fondo** del terminal.

Con **`npm run cli -- splash --animate`** (TTY y color activo), el cartel se **redibuja** unos segundos para que la onda azul/blanco se mueva sobre las letras.

Implementación: [`apps/cli/lib/banner-pixel.mjs`](../apps/cli/lib/banner-pixel.mjs) y [`apps/cli/lib/banner.mjs`](../apps/cli/lib/banner.mjs).

- **Quitar cualquier cabecera:** `AGENTICX402_NO_BANNER=1`.
- **`NO_COLOR=1`:** sin ANSI; los bloques se muestran como `#` y la sombra como `:` para legibilidad ASCII.
- **`fetch` / `call`:** no muestran el banner largo; **`list`** y **`-h`** sí el bloque pixel + tagline, o **una línea compacta** según el caso.

## Pantalla `splash`

Misma cabecera pixel con tagline `CLI · STELLAR TESTNET · X402`, lista de comandos y reglas (sin fondo forzado).

```bash
npm run cli -- splash
npm run cli -- splash --animate   # o -a
```

- **`--animate`:** en TTY, una **línea** con indicador tipo `·` que rota (~1 s); no borra la pantalla entera.

## Variables de entorno

Ver [`.env.example`](../.env.example). Mínimo para pagar un 402:

- `STELLAR_SECRET_KEY` — clave `S...` de una cuenta con fondos en la red que exija el servicio (típicamente **testnet**).

Sin `STELLAR_SECRET_KEY`, `fetch` y `call` solo hacen una petición normal; si la respuesta es **402**, el CLI indica que falta la clave.

En **testnet con USDC**, la cuenta suele necesitar **trustline** al emisor antes de que el pago funcione. Guía orientada a agentes: [`agents-stellar-trustline.md`](./agents-stellar-trustline.md).

## Comandos

| Comando | Descripción |
|---------|-------------|
| `doctor` | Comprueba Node, `STELLAR_SECRET_KEY`, catálogo y muestra recordatorios (trustline, testnet). |
| `splash` | Resumen de comandos; `--animate` / `-a` indicador breve (TTY). |
| `list` | Imprime servicios del catálogo (archivo local o `AGENTICX402_CATALOG_URL`). |
| `fetch <url>` | GET (o `--method`) a una URL completa. |
| `call <id> --path /ruta` | Construye URL con `baseUrl` del servicio `id` en el catálogo + `path`. |

`-h` / `--help` muestra la ayuda completa; `--version` imprime el nombre y versión del paquete (`package.json`).

## Probar un 402 real

1. Obtén USDC/XLM de testnet según [quickstart x402](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide).
2. Exporta `STELLAR_SECRET_KEY`.
3. Usa una URL documentada del proveedor (p. ej. un endpoint listado en [xlm402.com](https://xlm402.com)):

```bash
npm run cli -- fetch "https://…endpoint-documentado…"
```

Si el servidor exige **mainnet**, ajusta `STELLAR_NETWORK=pubnet` y una clave con fondos en mainnet (solo si sabes lo que haces).

## Depuración

- Respuestas no JSON se imprimen como texto.
- Código de salida distinto de 0 si el HTTP final no es 2xx.
