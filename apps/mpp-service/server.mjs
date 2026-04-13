#!/usr/bin/env node
/**
 * PumaX402 **mpp-service** — Implementación de referencia de MPP (Machine Payments Protocol).
 * Demuestra pagos per-request (Charge) sin facilitadores externos, directos a Stellar.
 */
import express from "express";
import crypto from "crypto";

const port = Number(process.env.PORT) || 3854;
const payTo = process.env.MPP_X402_PAYTO || "G... (RECIPIENT)";
const price = process.env.MPP_X402_PRICE || "0.005"; // USDC

const app = express();
app.use(express.json());

// In-memory store for challenges (simulated)
const challenges = new Map();

app.get("/", (_req, res) => {
  res.json({
    service: "pumax402-mpp-service",
    protocol: "MPP (Machine Payments Protocol)",
    tagline: "Pagos de máquina a máquina ultra-rápidos en Stellar.",
    endpoints: {
      data: { method: "GET", path: "/v1/data", payment: "MPP Charge (Stripe/Stellar spec)" }
    }
  });
});

app.get("/v1/data", (req, res) => {
  const auth = req.get("Authorization");

  if (!auth || !auth.startsWith("Charge")) {
    const challenge = crypto.randomBytes(16).toString("hex");
    const mppHeader = `Charge challenge="${challenge}", recipient="${payTo}", amount="${price}", currency="USDC", network="stellar:testnet"`;
    
    // Store challenge for verification (simplified)
    challenges.set(challenge, { expires: Date.now() + 60000 });

    res.set("WWW-Authenticate", mppHeader);
    return res.status(402).json({
      error: "payment_required",
      protocol: "MPP",
      challenge,
      instruction: "Usa un cliente MPP (como @stellar/mpp) para resolver el desafío Charge."
    });
  }

  // Simplified verification: we assume any "Charge" auth is valid for this demo
  // In real life, we would decode the credential and check the Stellar tx/signature.
  res.json({
    result: "MPP Data unlocked",
    timestamp: new Date().toISOString(),
    message: "Gracias por usar el protocolo de pagos de máquina de PumaX402.",
    data: {
      market_sentiment: "BULLISH",
      liquidity_index: 0.89
    }
  });
});

app.listen(port, () => {
  console.error(`PumaX402 MPP Service listo en http://127.0.0.1:${port}/`);
  console.error(`  Endpoint MPP: /v1/data  Price: ${price} USDC`);
});
