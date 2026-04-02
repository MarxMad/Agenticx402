# Catálogo de servicios

El archivo fuente es **`services.json`**. Cada entrada representa un proveedor o agrupación accesible vía x402 (Stellar).

## Añadir un servicio

1. Haz fork o rama de este repo.
2. Añade un objeto en el array `services` con al menos:
   - `id` (slug único, kebab-case)
   - `name`, `description`, `baseUrl`
   - `tags` (p. ej. `weather`, `data`, `defi`)
   - `status`: `active` | `draft` | `deprecated`
   - `source`: `external` | `internal` | `community`
3. Si el precio varía por ruta, usa `pricingNote` o documenta en `docsUrl`.
4. Abre un PR; mantén **testnet** en el MVP salvo acuerdo explícito.

No incluyas claves ni secretos en este directorio.

## Esquema relajado (MVP)

Algunos campos son opcionales hasta que la Fase 2 fije contratos de `call`. El array `paths` puede ir vacío si el hub solo enlaza al sitio del proveedor.
