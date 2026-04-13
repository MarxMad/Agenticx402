# PumaX402 — Agentic Services Hub on Stellar

<p align="center">
  <a href="https://agenticx402-production.up.railway.app/"><img src="https://img.shields.io/badge/Hub-live-3B82F6?style=flat-square" alt="Live hub" /></a>
  <a href="https://github.com/MarxMad/Agenticx402"><img src="https://img.shields.io/badge/repo-Agenticx402-181717?style=flat-square&logo=github" alt="Repository" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D20-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 20+" />
  <img src="https://img.shields.io/badge/license-MIT-888888?style=flat-square" alt="MIT License" />
</p>

**A unified catalog and access layer for [x402](https://www.x402.org/) and [MPP](https://mpp.dev) services on [Stellar](https://stellar.org):** discover, pay per request, and consume APIs with a single mental model—designed for AI agents and machine-to-machine (M2M) economies.

---

## 🚀 The Vision
Agents can reason, plan, and act—until they hit a paywall. **PumaX402** removes this barrier by providing a **standardized infrastructure** where agents can find paid tools, receive sponsored funding, and execute micropayments using USDC or EURC in seconds.

---

## 🏗️ What is PumaX402?
It is a **Platform-as-a-Catalog** that provides:
1.  **Discovery**: A curated registry of agent-friendly services.
2.  **Sponsored Onboarding**: Zero-XLM account setup for agents via [Stellar Sponsorship](https://developers.stellar.org/docs/learn/fundamentals/stellars-blockchain/sponsorship).
3.  **Multi-Protocol Engine**: Native support for **x402 V2** (Exact) and **MPP Charge** (Machine Payments Protocol).
4.  **Economic Guardrails**: Soroban smart contracts that enforce daily spending limits for agents.

---

## 🛠️ First-party APIs (The "Why Us")
We maintain flagship services that demonstrate the power of agentic payments on Stellar:

| Service | Catalog ID | Value for Agents |
|---------|------------|------------------|
| **Agent Pulse** | `pumax402-agent-pulse` | Packaged network context (ledgers, fees, hints) to prevent agent hallucinations. |
| **DEX Signal** | `pumax402-stellar-dex-signal` | High-speed trading signals from Horizon/SDEX with consistent schemas. |
| **Geo-Risk** | `pumax402-geopolitical-risk` | Orchestrated risk signal aggregating multiple data sources into one paid call. |
| **Energy Signal** | `pumax402-energy-signal` | LLM-powered (Groq) or heuristic signals for energy resource management. |
| **MPP Reference** | `pumax402-mpp-service` | Direct M2M payment demo using the Charge protocol (Stripe/Stellar spec). |

---

## 📦 Repository Structure

| Layer | Path | Description |
|-------|------|-------------|
| **UI** | `apps/catalog-web` | Aesthetic, responsive dashboard with real-time activity log. |
| **API** | `apps/catalog-api` | REST discovery layer & Activity SSE stream. |
| **CLI** | `apps/cli` | Professional toolset: `doctor`, `list`, `fetch`, `call`. |
| **MCP** | `apps/mcp` | Stdio server for AI agents (Claude Code, Cursor) with advanced tools. |
| **Contracts** | `soroban/contracts` | Smart contracts for Trustlines and Daily Spending Limits. |
| **Skill** | `skill/` | Integrated Stellar development playbook (Knowledge base). |

---

## 🚦 Getting Started (For IA Agents & Builders)

### 1. Unified Setup
```bash
git clone https://github.com/MarxMad/Agenticx402.git
cd Agenticx402
npm install
npm run cli -- doctor
```

### 2. Sponsored Account Creation (Zero XLM)
Agents don't need XLM to start. Use our MCP tool or the internal sponsorship logic:
```bash
# Set your hub keys in .env
npm run mcp
# Access 'sponsor_agent_account' via your AI client
```

### 3. Run the Ecosystem
```bash
npm run dev:all  # Launches Hub + all 5 microservices
```

### 4. Verify with E2E Tests
```bash
npm run test:e2e  # Validates Hub, x402 V2, MPP, and MCP connectivity
```

---

## 🧠 Smart Contracts & Governance
| Contract | Purpose |
|----------|---------|
| [`spending_limit`](./soroban/contracts/spending_limit) | Enforces a daily USDC limit so your agent doesn't overspend. |
| [`hello_trustline`](./soroban/contracts/hello_trustline) | Modern constructor pattern (Protocol 22+) for setting up agent trusts. |

---

## 📈 Business Model
PumaX402 is designed for sustainability:
- **Take Rate**: Small percentage on transaction volume.
- **Provider SaaS**: Analytics and search priority for API vendors.
- **Enterprise Governance**: Custom budgets and audit logs for agent fleets.
Full details: [`BUSINESS_MODEL.md`](./BUSINESS_MODEL.md).

---

## 📖 Integrated Knowledge (Stellar Skills)
Access official documentation directly from the repo:
- [Stellar Master Skill](./skill/SKILL.md)
- [Soroban Development](./skill/contracts-soroban.md)
- [x402 Protocol](./skill/x402.md)
- [MPP (Machine Payments)](./skill/mpp.md)
- [Security Checklist](./skill/security.md)

---

## 🛠️ Tech Stack
- **Runtime**: Node.js 20+ (ESM)
- **Stellar**: `stellar-sdk`, `stellar-cli`, Soroban (Rust)
- **Payments**: `@x402/core`, `@x402/stellar`, `@x402/express`
- **Agents**: Model Context Protocol (MCP)
- **UI**: Vanilla HTML/JS/CSS with "Rich Aesthetics" and Dynamic Design.

---

## 📜 Credits
PumaX402 follows the standards defined by the **Stellar Development Skills** framework (April 2026).  
*Built for the agentic future.*
