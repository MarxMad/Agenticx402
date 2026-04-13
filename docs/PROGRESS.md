# Project Progress (For Contributors)

This file is the **operational source of truth**: what phase is active, what is already in the repo, and what is missing. Update it when closing tasks or opening relevant PRs.

**Last Document Review:** 2026-04-13

---

## Change Log (April 2026)

### [2026-04-13] Final Hackathon Polish (Towards First Place)
- **Multi-Payment Protocol:** Implementation of `mpp-service` to support MPP (Machine Payments Protocol / Stripe) in addition to x402.
- **Economic Guardrails (Soroban):** Creation of the `spending_limit` contract to establish daily spending policies for agents.
- **Advanced MCP Tools:** Updated the MCP server with sponsored onboarding and account status check tools.
- **100% Alignment:** Verified compliance with all delivery requirements (Repo, Video Script, Stellar Interaction).

### [2026-04-13] Stellar Dev Skill Integration
- **Native Knowledge:** Integrated `./skill/` with guides on Soroban, x402, MPP, Security, Testing, and API (RPC vs Horizon).
- **Soroban Workspace:** Created `./soroban/contracts/hello_trustline` as a base example for smart contracts.
- **Microservices:** Audited `energy-signal` and implemented massive orchestration with `npm run dev:all`.
- **Standardization:** Updated `package.json` with build scripts and skill support.

---

## Phase Summary

| Phase | Name | Repo Status | Responsible | Next Action |
|------|--------|----------------|----------------------|------------------|
| **0** | Landing (Wallets + Local x402 E2E) | **Guide + `npm run fase0:check`** | Each Dev | Check `.env` + `X402_SMOKE_URL` |
| **1** | Hub Foundations (Catalog + API + UI) | **Complete** | Core Hub | Add entries to `catalog/services.json` |
| **2** | x402 Client (CLI) | **Complete** | Stellar Integration | Setup `STELLAR_SECRET_KEY` + `npm run cli -- fetch` |
| **3** | MCP / Agent Skill | **Complete** | Agent UX | Register MCP server in Cursor/Claude |
| **4** | Demo + Deploy + Pitch | **Docker + Docs** | Whole Team | Video demo + Railway deployment |

---

## Technical Features Implemented

| Component | Location | How to Test |
|------------|-----------|----------------|
| **Catalog API** | [`apps/catalog-api/server.mjs`](../apps/catalog-api/server.mjs) | `npm run catalog:dev` → `GET /services` |
| **Puma Hub UI** | [`apps/catalog-web/index.html`](../apps/catalog-web/index.html) | `npm run catalog:dev` → `http://127.0.0.1:3840/` |
| **Agent CLI** | [`apps/cli/bin/agenticx402.mjs`](../apps/cli/bin/agenticx402.mjs) | `npm run cli -- help` |
| **MCP Server** | [`apps/mcp/server.mjs`](../apps/mcp/server.mjs) | `npm run mcp` |
| **E2E Test Suite** | [`scripts/e2e-test.mjs`](../scripts/e2e-test.mjs) | `npm run test:e2e` |
| **Sponsored Onboarding** | [`apps/shared/trustline.mjs`](../apps/shared/trustline.mjs) | Use MCP tool `sponsor_agent_account` |

---

## Quick Links

- [Main README](../README.md)
- [CLI Guide](./cli.md)
- [MCP Documentation](./mcp.md)
- [Deploy Guide](./deploy.md)
- [Business Model](../BUSINESS_MODEL.md)
- [Stellar Knowledge Base](../skill/SKILL.md)
