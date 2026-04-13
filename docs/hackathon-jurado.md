# Hackathon Guide — Jury, Stellar/x402, and Demo

This document is for **explaining the project with clarity** and preparing the **demo + public URL**.

---

## 1. The Problem (30-second Pitch)

Today, there are APIs that charge **per request** using the **HTTP 402** standard and on-chain payments. An agent (or a human with scripts) gets lost among **different URLs**, **different formats**, and **how to sign the payment** for each one.

**PumaX402** provides three concrete solutions:

1. **Catalog** — Service profile, base URL, network (e.g., Stellar testnet), tags, and documentation links (versioned data + API + web).
2. **Unified Client** — CLI (and MCP) that handles the **"request → if 402, pay on Stellar → retry"** flow for any catalog or direct URL.
3. **Agent Interface** — MCP allowing an LLM to **list** services and **call** one without inventing ad-hoc integrations.

We do not replace the **facilitator** or the **x402 server** of each provider: **we orchestrate discovery + payment client** on top of the standard ecosystem.

---

## 2. Stellar vs. x402 (Clarifying Concepts)

| Concept | Role in this Project |
|----------|----------------------|
| **Stellar** | The network where x402 flows are **settled** (USDC/XLM assets, accounts, signing). |
| **x402** | **Protocol over HTTP**: The server responds with **402 Payment Required**; the client **signs** and **retries** the request with payment headers. |
| **Facilitator** | Network service (e.g., *Built on Stellar*) that **verifies and settles** the payment. Used by the **remote services** you call. |
| **@x402/core + @x402/stellar** | NPM libraries used by our **CLI/MCP** to build the HTTP client that understands 402 and signs with **Exact Stellar**. |

**In one sentence for the jury:** *"PumaX402 is the directory and the remote control; Stellar + x402 are the payment rails; we make agents and humans discover and pay in a unified way."*

---

## 3. Technology Stack

| Component | Technology | Location |
|-------|------------|--------|
| Hub Web + Catalog API | Node.js `http`, Vanilla HTML/JS | `apps/catalog-api/server.mjs`, `apps/catalog-web/` |
| Catalog Data | Versioned JSON | `catalog/services.json` |
| x402 Client | `@x402/core`, `@x402/stellar` | `apps/cli/lib/x402-fetch.mjs` |
| CLI | Node, `parseArgs` | `apps/cli/bin/agenticx402.mjs` |
| MCP | `@modelcontextprotocol/sdk`, `zod` | `apps/mcp/server.mjs` |
| Docker | Hub-only image | `Dockerfile` |

---

## 4. Public Deployment

We recommend using **Railway**, **Render**, or **Fly.io** for real-time Node processes. The Hub is already live at: [agenticx402-production.up.railway.app](https://agenticx402-production.up.railway.app/).

---

## 5. Demo Video Script (~2–4 min)

Goal: The jury must **see** Catalog → Client → (Optional) Payment.

| Time | On-Screen | Narrative |
|---------------|------------------------|------------------|
| 0:00–0:20 | PumaX402 Branding | "Agents need to discover and pay for APIs per request. We unify discovery and the payment client." |
| 0:20–0:50 | **Web Hub** (`/`) | "A living catalog: REST API and UI delivering the same data for humans and machines." |
| 0:50–1:30 | **Terminal / MCP** | "A single CLI/MCP: the agent doesn't need to manually integrate each API." |
| 1:30–2:30 | **402 Interaction** | "Showing the 402 error, signing the auth entry, and receiving the 200 OK response on testnet." |
| 2:30–End | **Architecture Diagram** | "PumaX402: The entry point for the agentic economy on Stellar." |

---

## 6. Official Resources

- **Live Hub:** [agenticx402-production.up.railway.app](https://agenticx402-production.up.railway.app/)
- [Stellar x402 Docs](https://developers.stellar.org/docs/build/agentic-payments/x402)
- [Stellar Quickstart](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide)
- Project Repo: [github.com/MarxMad/Agenticx402](https://github.com/MarxMad/Agenticx402)
