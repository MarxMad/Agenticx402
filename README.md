# PumaX402

<p align="center">
  <a href="https://agenticx402-production.up.railway.app/"><img src="https://img.shields.io/badge/Hub-live-3B82F6?style=flat-square" alt="Live hub" /></a>
  <a href="https://github.com/MarxMad/Agenticx402"><img src="https://img.shields.io/badge/repo-Agenticx402-181717?style=flat-square&logo=github" alt="Repository" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D20-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 20+" />
  <img src="https://img.shields.io/badge/license-MIT-888888?style=flat-square" alt="MIT License" />
</p>

**A unified catalog and access layer for [x402](https://www.x402.org/) services on [Stellar](https://stellar.org):** discover, pay per request, and consume APIs with the same HTTP 402 → sign → retry flow—for agents and human operators alike.

| | |
| :--- | :--- |
| **Public hub** | [**agenticx402-production.up.railway.app**](https://agenticx402-production.up.railway.app/) |
| **Catalog API** | `GET` [`/services`](https://agenticx402-production.up.railway.app/services) · `GET /services/:id` · [`/health`](https://agenticx402-production.up.railway.app/health) |
| **Source** | [github.com/MarxMad/Agenticx402](https://github.com/MarxMad/Agenticx402) |
| **Remote catalog (CLI)** | `AGENTICX402_CATALOG_URL=https://agenticx402-production.up.railway.app/services` |

---

## Vision

> An operational directory of x402 microservices on Stellar and a single front door to call them with one mental model: *pay per request, without bespoke integrations per provider*.

---

## What’s in this repo

| Layer | Contents |
|------|----------|
| **Hub** | REST API + web UI (`apps/catalog-api`, `apps/catalog-web`): listing, filters, linked documentation. |
| **CLI** | `agenticx402` client: `doctor`, `list`, `fetch`, `call` with Stellar x402 — [`docs/cli.md`](./docs/cli.md) |
| **MCP** | Stdio server: `list_services`, `call_service` — [`docs/mcp.md`](./docs/mcp.md) · [`docs/mcp-demo.md`](./docs/mcp-demo.md) |
| **Reference services** | Agent Pulse, DEX signals (Horizon), geopolitical risk (x402 orchestration). |
| **Operations** | [`Dockerfile`](./Dockerfile) · [`docs/deploy.md`](./docs/deploy.md) |

---

## Architecture

```mermaid
flowchart LR
  subgraph agents [Agents and operators]
    LLM[LLM / CLI]
    MCP[MCP]
  end

  subgraph hub [PumaX402 hub]
    CAT[REST catalog]
    UI[Web UI]
  end

  subgraph stellar [Stellar and x402]
    SVC[x402 services]
    FAC[Facilitator]
  end

  LLM --> CAT
  MCP --> CAT
  LLM -->|402 and signing| SVC
  MCP -->|402 and signing| SVC
  CAT --> UI
  SVC --> FAC
```

The catalog does **not** replace the facilitator: it publishes metadata and links; each service implements x402 per the [Stellar guide](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide).

---

## Quick start

```bash
git clone https://github.com/MarxMad/Agenticx402.git
cd Agenticx402
npm install
npm run cli -- doctor
```

| Goal | Command |
|------|---------|
| Local hub (API + UI, default port **3840**) | `npm run catalog:dev` |
| List services (repo catalog) | `npm run cli -- list` |
| List against the public hub | `AGENTICX402_CATALOG_URL=https://agenticx402-production.up.railway.app/services npm run cli -- list` |
| MCP server | `npm run mcp` |

Environment variables and keys: [`.env.example`](./.env.example). Testnet payments: USDC trustline guide [`docs/agents-stellar-trustline.md`](./docs/agents-stellar-trustline.md).

---

## Hub API (local or deployed)

| Route | Description |
|------|-------------|
| `GET /` | Hub web UI |
| `GET /services` | Full catalog JSON |
| `GET /services/:id` | Single service |
| `GET /health` | Process health |

Source data: [`catalog/services.json`](./catalog/services.json). Validate before contributing: `npm run catalog:validate`. How to add entries: [`catalog/README.md`](./catalog/README.md).

---

## Catalog services (reference)

| Service | Role |
|---------|------|
| **Agent Pulse** (`pumax402-agent-pulse`) | Network context for agent prompts after x402 payment (USDC testnet). [`apps/puma-service/README.md`](./apps/puma-service/README.md) |
| **DEX Signal** (`pumax402-stellar-dex-signal`) | Horizon signals (order book, trades, pools). [`apps/stellar-dex-signal/README.md`](./apps/stellar-dex-signal/README.md) |
| **Geopolitical Risk** (`pumax402-geopolitical-risk`) | Risk aggregation with x402 upstream. [`apps/geopolitical-risk/README.md`](./apps/geopolitical-risk/README.md) |

Local Agent Pulse example (two terminals):

```bash
export PUMA_X402_PAYTO=G...   # receive address with USDC testnet trustline
npm run puma-service

export STELLAR_SECRET_KEY=S...   # payer
npm run cli -- fetch "http://127.0.0.1:3850/v1/pulse"
```

Other services: `npm run dex-signal` · `npm run geopolitical-risk` — routes and pricing in each README and in the catalog JSON.

---

## CLI — common commands

**Invocation:** `npm run cli -- <command>` (the `--` separates npm args from CLI args).

| Command | Purpose |
|---------|---------|
| `doctor` | Check Node, environment, catalog, and Stellar reminders. |
| `list` | List catalog services. |
| `fetch "<url>"` | HTTP request; on 402, sign and retry if `STELLAR_SECRET_KEY` is set. |
| `call <id> --path /route` | Resolve `baseUrl` from the catalog and run the same x402 flow. |
| `splash` / `splash --animate` | Terminal branding. |

Details: [`docs/cli.md`](./docs/cli.md) · linkable `agenticx402` binary after `npm link`.

---

## Documentation

| Doc | Topic |
|-----|-------|
| [`docs/PROGRESS.md`](./docs/PROGRESS.md) | Project status and changelog |
| [`docs/setup-fase-0.md`](./docs/setup-fase-0.md) | Stellar environment / testnet wallet |
| [`docs/deploy.md`](./docs/deploy.md) | Hub deployment |
| [`docs/hackathon-jurado.md`](./docs/hackathon-jurado.md) | Pitch, Stellar/x402 messaging, AV script (Spanish) |
| [`docs/x402-stellar-panorama.md`](./docs/x402-stellar-panorama.md) | Ecosystem overview |
| [`docs/docs.md`](./docs/docs.md) | Curated Stellar, x402, MCP links |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Contributing |
| [`BUSINESS_MODEL.md`](./BUSINESS_MODEL.md) | Business model |

Local checklist: `npm run fase0:check`. Hub with Docker:

```bash
docker build -t pumax402-hub .
docker run --rm -p 8080:8080 -e PORT=8080 pumax402-hub
```

Open `http://127.0.0.1:8080/` and `/health`.

---

## Stack

| Area | Technology |
|------|------------|
| Runtime | Node.js 20+ |
| Agentic payments | [`@x402/core`](https://www.npmjs.com/package/@x402/core), [`@x402/stellar`](https://www.npmjs.com/package/@x402/stellar) |
| Agents | MCP [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk) |
| Network | Stellar (testnet by default in examples); facilitator per [Stellar docs](https://developers.stellar.org/docs/build/agentic-payments/x402/built-on-stellar) |
| Catalog | Versioned JSON (`catalog/services.json`) |

---

## License

[MIT](./LICENSE)

---

*PumaX402 — x402 service hub for the agentic ecosystem on Stellar.* Issues and pull requests: [MarxMad/Agenticx402](https://github.com/MarxMad/Agenticx402).
