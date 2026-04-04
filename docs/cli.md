# CLI `agenticx402` (Fase 2)

Cliente de línea de comandos que resuelve el flujo **HTTP 402 → firma Stellar (Exact) → reintento** usando [`@x402/core`](https://www.npmjs.com/package/@x402/core) y [`@x402/stellar`](https://www.npmjs.com/package/@x402/stellar).

## Instalación local

Desde la raíz del repo (tras `npm install`):

```bash
npm run cli -- list
```

O con bin global tras `npm link` (opcional):

```bash
agenticx402 list
```

## Banner visual (terminal)

Al ejecutar `npm run cli -- -h` o `list`, el CLI muestra un **medallón** en texto: anillo exterior, **silueta de puma en perfil** (píxeles `█`), fila tipo red (`○─·─○`), **x402** y paleta **oro sobre azul marino** (ANSI). La referencia gráfica sigue siendo [`assets/logo.png`](../assets/logo.png); en terminal es una reinterpretación pixel, no el vector.

- **Quitar el dibujo por completo:** `AGENTICX402_NO_BANNER=1`.
- **Solo sin colores:** `NO_COLOR=1` mantiene el arte ASCII en blanco y negro (útil en terminales o CI que no soportan ANSI).
- **`fetch` / `call`:** no imprimen el banner grande para no mezclar con JSON en stdout; solo `list` y la ayuda.

## Pantalla “consola PUMA” (splash)

Vista completa inspirada en mockups tipo **PUMA SYSTEM CLI**: barra de título `==== [ … ] ====`, menú `File | Network | Stellar`, separadores, **campo de constelaciones** (caracteres que cambian), medallón con puma + x402 y un bloque de **prompt simulado** (`puma@stellar-testnet:~$ …`).

```bash
npm run cli -- splash
npm run cli -- splash --animate   # o -a
```

- **Dinámico (`--animate`):** en una **TTY** y **sin** `NO_COLOR`, limpia la pantalla unas veces y **redibuja** las filas de constelación (semilla distinta por frame) + oculta el cursor durante ~3 s. No es un motor gráfico: es ANSI + texto; para UI tipo Ink/blessed haría falta otra dependencia.
- En **CI**, **pipes** o `NO_COLOR=1` solo se imprime la versión **estática** (sin animación ni `clear`).

## Variables de entorno

Ver [`.env.example`](../.env.example). Mínimo para pagar un 402:

- `STELLAR_SECRET_KEY` — clave `S...` de una cuenta con fondos en la red que exija el servicio (típicamente **testnet**).

Sin `STELLAR_SECRET_KEY`, `fetch` y `call` solo hacen una petición normal; si la respuesta es **402**, el CLI indica que falta la clave.

## Comandos

| Comando | Descripción |
|---------|-------------|
| `splash` | Pantalla completa estilo consola; `--animate` / `-a` para constelación viva (TTY). |
| `list` | Imprime servicios del catálogo (archivo local o `AGENTICX402_CATALOG_URL`). |
| `fetch <url>` | GET (o `--method`) a una URL completa. |
| `call <id> --path /ruta` | Construye URL con `baseUrl` del servicio `id` en el catálogo + `path`. |

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
