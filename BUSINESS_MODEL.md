# Modelo de negocio — Agenticx402

Documento de referencia para alinear visión de producto, monetización y narrativa frente a inversores, jurados de hackathon o socios.

## Posicionamiento

Agenticx402 no es solo un directorio de endpoints: es la capa que permite a **agentes y equipos** descubrir, pagar y orquestar servicios **pay-per-request** sobre Stellar mediante **x402**, con integración única, observabilidad y control de gasto.

Analogía útil: *infraestructura de routing + pagos para el consumo de herramientas por máquinas*, no una lista de enlaces.

## Fuentes de ingresos

### 1. Take rate sobre el GMV (principal)

Se cobra un porcentaje (y/o fee mínimo) sobre el volumen bruto de micropagos que pasan por el hub cuando el cliente usa el cliente oficial, el router o el gateway MCP.

| Parámetro | Rango orientativo | Notas |
|-----------|-------------------|--------|
| Take rate | 5% – 12% | Ajustar según ticket medio y competencia; en tickets muy bajos conviene fee mínimo simbólico |
| Fee mínimo | Opcional (p. ej. equivalente a fracciones de céntimo) | Evita operaciones no rentables sin ahogar adopción |

**Quién paga la comisión** (política comercial, a negociar por integración):

- **Pagador final** (consumidor del servicio, vía markup transparente).
- **Proveedor** (absorbe el fee a cambio de distribución y fiabilidad).
- **Split** (por defecto suele ser lo más equilibrado para escalar).

### 2. Suscripción SaaS para proveedores (B2B)

Ingreso recurrente por mantener y promover servicios en el catálogo, con herramientas operativas.

| Plan | Propuesta de valor | Precio orientativo (USD/mes) |
|------|-------------------|------------------------------|
| **Free** | Listado básico, visibilidad en red de prueba, límites de analítica | $0 |
| **Pro** | Analítica (llamadas, ingresos, latencia), health checks, badges de verificación básica, prioridad en resultados de búsqueda dentro del hub | $79 – $149 |
| **Scale** | Límites altos, SLAs de soporte, catálogo privado para un cliente o equipo, integraciones personalizadas | $499 – $2.000+ (custom quote) |

Los rangos son **orientativos**; se calibran tras primeros pilotos y coste real de infraestructura y soporte.

### 3. Capa premium para equipos que operan agentes (B2B)

Funciones dirigidas a empresas y builders que necesitan producción, no solo demos:

- Routing por costo y latencia, fallback entre proveedores equivalentes.
- **Presupuestos por agente** (spend caps) y alertas.
- **Audit logs** y exportación para contabilidad o compliance interna.
- Políticas por entorno (testnet vs mainnet) y claves gestionadas.

| Oferta | Modelo | Precio orientativo |
|--------|--------|-------------------|
| **Team** | Suscripción mensual + posible fee reducido en GMV | $199 – $499/mes |
| **Enterprise** | Contrato anual, SSO, VPC/región, SLA | Negociado |

### 4. Revenue share con servicios verticales

Acuerdos con proveedores de alto valor (datos financieros, cumplimiento, analítica especializada) donde Agenticx402 aporta **descubrimiento y volumen agentic** y recibe un **porcentaje acordado** sobre el GMV generado por esas integraciones, además o en lugar del take rate estándar.

## Fórmula resumida de ingresos

```
Ingresos ≈ (GMV × take rate promedio) + MRR proveedores + MRR equipos agente + acuerdos de revenue share
```

**GMV** (Gross Merchandise Value): suma del valor de los micropagos procesados a través del hub (antes de comisiones de red o terceros).

## Ejemplo numérico ilustrativo (no proyección formal)

Supuestos solo para comunicar magnitud de orden:

| Concepto | Valor ejemplo |
|----------|----------------|
| GMV mensual vía hub | $100.000 |
| Take rate promedio | 8% |
| … Ingreso por transacciones | **$8.000** |
| 25 cuentas Pro proveedor × ~$99 | **~$2.475** |
| 5 cuentas Team × ~$299 | **~$1.495** |
| **Total orientativo** | **~$11.970/mes** |

Este escenario sirve para pitch interno; la financiera formal requiere supuestos de retención, churn y coste marginal por request.

## Ventaja competitiva defendible (por qué pagan)

- **Una integración** frente a N integraciones x402 ad hoc por proveedor.
- **Mayor tasa de éxito** en producción gracias a routing, reintentos y fallback.
- **Gobernanza**: límites de gasto y trazabilidad por agente o por proyecto.
- **Descubrimiento multi-fuente**: el hub puede indexar servicios públicos existentes y propios, sin depender de un solo listado.

## Go-to-market (orden sugerido)

1. **Lado supply**: incorporar 10–20 APIs ya “agent-friendly” o fáciles de envolver (incluyendo ejemplos de la comunidad Stellar/x402).
2. **Lado demand**: equipos que construyen agentes en Cursor, Claude Code o stacks propios y evitan pagar N integraciones.
3. **Mensaje central**: *“Un solo cliente/MCP para pagar y orquestar muchas herramientas sobre Stellar, con control de costes.”*

## Fases de monetización (cronología)

| Fase | Enfoque | Objetivo |
|------|---------|----------|
| **0 – Hackathon / MVP** | Demostrar flujo end-to-end; take rate opcional o “0% en testnet” para adopción | Validez técnica y narrativa |
| **1 – Primeros pilotos** | Take rate bajo + plan Pro simple para proveedores que quieren métricas | Primeros ingresos y feedback |
| **2 – Producto equipo** | Presupuestos, logs, routing avanzado como MRR | Bloquear uso B2B serio |
| **3 – Enterprise** | Catálogos privados, compliance, contratos anuales | Margen y retención altos |

## Riesgos y mitigación (resumen)

| Riesgo | Mitigación |
|--------|------------|
| Tickets muy bajos hacen que el % no cubra costes | Fee mínimo, volumen por cluster de requests, o foco inicial en servicios con precio por request suficiente |
| Competencia con listados gratuitos | Diferenciar por orquestación, MCP, analítica y control de gasto, no por “más links” |
| Dependencia del facilitator / red | Transparencia en costes on-chain, diseño multi-red solo si aporta valor (p. ej. rutas de coste vía proyectos tipo economic routing) |

## Próximos pasos de documentación interna

- Definir **política de fees** por red (testnet vs mainnet) y si el hackathon opera siempre a 0% para facilitar demos.
- Acordar **un único modelo de split** por defecto en contratos tipo proveedor.
- Tras el MVP, añadir **hoja de unidades económicas** (coste por 1M requests enrutados vs ingreso esperado).

---

*Este documento es una definición viva: ajústalo cuando tengas datos reales de uso y costes de infraestructura.*
