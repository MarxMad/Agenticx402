# Skills en este proyecto (Cursor)

## `stellar-dev`

Vendored desde [stellar/stellar-dev-skill](https://github.com/stellar/stellar-dev-skill) (Apache-2.0). Licencia: `stellar-dev/LICENSE-stellar-dev-skill`.

**Uso en Cursor:** invoca el skill con **`@stellar-dev`** en el chat o ámbalo como contexto cuando trabajes en Stellar / Soroban / x402.

**Actualizar** (desde la raíz del repo):

```bash
rm -rf .cursor/skills/stellar-dev && git clone --depth 1 https://github.com/stellar/stellar-dev-skill.git /tmp/stellar-dev-skill-up && \
  mkdir -p .cursor/skills/stellar-dev && cp -R /tmp/stellar-dev-skill-up/skill/. .cursor/skills/stellar-dev/ && \
  cp /tmp/stellar-dev-skill-up/LICENSE .cursor/skills/stellar-dev/LICENSE-stellar-dev-skill && rm -rf /tmp/stellar-dev-skill-up
```
