# Service Catalog

The source data is **`services.json`**. Each entry represents a provider or grouping accessible via x402 or MPP on Stellar.

## Adding a Service

1. Fork or branch this repository.
2. Add an object to the `services` array with at least the following:
   - `id` (unique slug, kebab-case)
   - `name`, `description`, `baseUrl`
   - `tags` (e.g., `weather`, `data`, `defi`)
   - `status`: `active` | `draft` | `deprecated`
   - `source`: `external` | `internal` | `community`
3. If the price varies by path, use `pricingNote` or document it in `docsUrl`.
4. Optional: `stellarPrerequisites` object with necessary trustlines to ensure smooth agent onboarding.
5. Open a PR; maintain **testnet** during the hacking phase unless otherwise agreed.

Do not include keys or secrets in this directory.

## Schema Policy

Fields like `paths` and `cost` are recommended for better CLI/MCP tool integration. The `source: team` tag is reserved for services maintained within this repository.
