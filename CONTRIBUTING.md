# Contribuir a PumaX402

Gracias por ayudar a construir el hub. Lee primero **[`docs/PROGRESS.md`](./docs/PROGRESS.md)** para ver en qué fase vamos y qué archivos tocar.

## Flujo general

1. Crea una rama desde `main`: `feat/…`, `fix/…` o `docs/…`.
2. Haz cambios acotados a una fase o tarea clara.
3. Si tocas el catálogo, ejecuta `npm run catalog:validate`.
4. Si tocas la API o la UI, prueba con `npm run catalog:dev` y revisa `/`, `/services` y `/health`.
5. Si tocas el CLI, ejecuta `npm run cli -- list` y revisa [`docs/cli.md`](./docs/cli.md).
6. Abre PR hacia `main` con descripción breve (qué fase cierra o avanza).

## Añadir un servicio al catálogo

Sigue **[`catalog/README.md`](./catalog/README.md)**. Reglas rápidas:

- Solo **testnet** en el MVP del hackathon, salvo acuerdo explícito del equipo.
- Sin claves, tokens ni datos personales en el JSON.
- `id` único en kebab-case; campos obligatorios según el validador (`npm run catalog:validate`).

## Estándares

- **Secretos:** nunca en git; usa `.env` local (ver `.gitignore`).
- **Commits:** mensajes claros en español o inglés, consistentes con el historial del repo.
- **Documentación:** si cambias el servidor, el CLI o el catálogo, actualiza `README.md`, `docs/cli.md` si aplica, y `docs/PROGRESS.md`.

## Dudas de producto o prioridad

Alinear con el responsable del hackathon o abrir un issue en [MarxMad/Agenticx402](https://github.com/MarxMad/Agenticx402) con etiqueta si las usáis internamente.
