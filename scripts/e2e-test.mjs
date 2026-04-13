#!/usr/bin/env node
/**
 * PumaX402 — E2E Comprehensive Test Suite
 * Arranca servicios, valida endpoints y flujos 402/MPP.
 */
import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";

const PORTS = {
  hub: 3840,
  pulse: 3850,
  dex: 3851,
  risk: 3852,
  energy: 3853,
  mpp: 3854,
};

const services = [];

async function startService(name, command, args, port, env = {}) {
  console.log(`[E2E] Arrancando ${name} en puerto ${port}...`);
  const proc = spawn("node", [command, ...args], {
    env: { ...process.env, PORT: port, ...env },
    stdio: "pipe",
  });
  
  services.push({ name, proc });

  // Wait for port to be ready (simple poll)
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/health`).catch(() => fetch(`http://127.0.0.1:${port}/`));
      if (res.ok || res.status === 402) {
        console.log(`  ✓ ${name} listo.`);
        return;
      }
    } catch {}
    await setTimeout(1000);
  }
}

async function runTests() {
  let failed = false;
  const test = async (desc, fn) => {
    try {
      await fn();
      console.log(`PASS: ${desc}`);
    } catch (e) {
      console.error(`FAIL: ${desc} -> ${e.message}`);
      failed = true;
    }
  };

  console.log("=== PUMAX402 E2E TEST SUITE ===\n");

  // 1. Hub Hub
  await test("Catalog API Health", async () => {
    const res = await fetch(`http://127.0.0.1:${PORTS.hub}/health`);
    const data = await res.json();
    if (!data.ok) throw new Error("Health not OK");
  });

  await test("Catalog Services List", async () => {
    const res = await fetch(`http://127.0.0.1:${PORTS.hub}/services`);
    const data = await res.json();
    if (!Array.isArray(data.services) || data.services.length === 0) throw new Error("Catalog empty");
    console.log(`  (Encontrados ${data.services.length} servicios)`);
  });

  // 2. x402 Services
  await test("Pulse Service x402 Header", async () => {
    const res = await fetch(`http://127.0.0.1:${PORTS.pulse}/v1/pulse`);
    if (res.status !== 402) throw new Error(`Expected 402, got ${res.status}`);
    
    const auth = res.headers.get("WWW-Authenticate") || res.headers.get("payment-required");
    if (!auth) throw new Error("Missing payment challenge header (WWW-Authenticate or payment-required).");
    console.log("  ✓ Recibido 402 challenge correctamente.");
  });

  await test("Energy Signal x402 Header", async () => {
    const res = await fetch(`http://127.0.0.1:${PORTS.energy}/v1/signal`);
    if (res.status !== 402) throw new Error(`Expected 402, got ${res.status}`);
    const auth = res.headers.get("WWW-Authenticate") || res.headers.get("payment-required");
    if (!auth) throw new Error("Missing payment challenge header.");
    console.log("  ✓ Recibido 402 challenge (Energy) correctamente.");
  });

  // 3. MPP Service
  await test("MPP Service Charge Header", async () => {
    const res = await fetch(`http://127.0.0.1:${PORTS.mpp}/v1/data`);
    if (res.status !== 402) throw new Error(`Expected 402, got ${res.status}`);
    const auth = res.headers.get("WWW-Authenticate");
    if (!auth || !auth.includes("Charge")) throw new Error("Missing Charge header");
    console.log("  ✓ Recibido 402 Charge (MPP) challenge correctamente.");
  });

  // 4. MCP Server Smoke
  await test("MCP Server Presence", async () => {
     // Just check if we can spawn it
     const proc = spawn("node", ["apps/mcp/server.mjs"], { stdio: "pipe" });
     await setTimeout(1000);
     if (proc.exitCode !== null) throw new Error("MCP crashed on start");
     proc.kill();
  });

  console.log("\n=== E2E SUMMARY ===");
  if (failed) {
    console.error("ALERTA: Algunos tests fallaron.");
    process.exit(1);
  } else {
    console.log("¡PERFECTO! PumaX402 está 100% operativo.");
  }
}

async function main() {
  try {
    // Start services in order
    await startService("Hub", "apps/catalog-api/server.mjs", [], PORTS.hub);
    await startService("Pulse", "apps/puma-service/server.mjs", [], PORTS.pulse, { PUMA_X402_PAYTO: "G..." });
    await startService("Energy", "apps/energy-signal/server.mjs", [], PORTS.energy, { ENERGY_X402_PAYTO: "G..." });
    await startService("MPP", "apps/mpp-service/server.mjs", [], PORTS.mpp);

    await runTests();
  } catch (e) {
    console.error("E2E FATAL ERROR:", e);
    process.exit(1);
  } finally {
    console.log("\nLimpiando servicios...");
    for (const s of services) {
      s.proc.kill();
    }
  }
}

main();
