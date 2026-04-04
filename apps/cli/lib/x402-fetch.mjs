import { x402Client, x402HTTPClient } from "@x402/core/client";
import {
  ExactStellarScheme,
  STELLAR_TESTNET_CAIP2,
  STELLAR_PUBNET_CAIP2,
  createEd25519Signer,
} from "@x402/stellar";

/**
 * @param {string} secretKey - S... (Stellar secret)
 * @param {{ network?: 'testnet'|'pubnet', rpcUrl?: string }} [opts]
 */
export function createPaywallHttpClient(secretKey, opts = {}) {
  const net = opts.network || "testnet";
  const caip2 = net === "pubnet" ? STELLAR_PUBNET_CAIP2 : STELLAR_TESTNET_CAIP2;
  const signer = createEd25519Signer(secretKey, caip2);
  const rpcUrl = opts.rpcUrl ?? process.env.STELLAR_SOROBAN_RPC_URL?.trim();
  const rpcConfig = rpcUrl ? { rpcUrl } : undefined;
  const scheme = new ExactStellarScheme(signer, rpcConfig);
  const client = x402Client.fromConfig({
    schemes: [{ network: caip2, client: scheme }],
  });
  return new x402HTTPClient(client);
}

function flattenHeaders(headersInit) {
  if (!headersInit) return {};
  if (headersInit instanceof Headers) {
    return Object.fromEntries(headersInit.entries());
  }
  if (Array.isArray(headersInit)) {
    return Object.fromEntries(headersInit);
  }
  return { ...headersInit };
}

/**
 * fetch que, ante 402, firma (Exact Stellar) y reintenta una vez.
 *
 * @param {string} url
 * @param {RequestInit} [init]
 * @param {{ httpClient: import("@x402/core/client").x402HTTPClient }} ctx
 */
export async function paywallFetch(url, init, { httpClient }) {
  const first = await fetch(url, init);
  if (first.status !== 402) {
    return first;
  }

  const bodyText = await first.text();
  let bodyObj;
  try {
    bodyObj = bodyText ? JSON.parse(bodyText) : undefined;
  } catch {
    bodyObj = undefined;
  }

  const getHeader = (name) => {
    const direct = first.headers.get(name);
    if (direct != null) return direct;
    const lower = name.toLowerCase();
    for (const [k, v] of first.headers.entries()) {
      if (k.toLowerCase() === lower) return v;
    }
    return void 0;
  };

  const paymentRequired = httpClient.getPaymentRequiredResponse(getHeader, bodyObj);
  const preHeaders = await httpClient.handlePaymentRequired(paymentRequired);
  if (preHeaders) {
    const merged = { ...flattenHeaders(init?.headers), ...preHeaders };
    return fetch(url, { ...init, headers: merged });
  }

  const paymentPayload = await httpClient.createPaymentPayload(paymentRequired);
  const payHeaders = httpClient.encodePaymentSignatureHeader(paymentPayload);
  const merged = { ...flattenHeaders(init?.headers), ...payHeaders };
  return fetch(url, { ...init, headers: merged });
}
