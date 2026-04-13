#!/usr/bin/env node
/**
 * MCP PumaX402 — stdio. Tools: list_services, call_service.
 * Mismas variables que el CLI (STELLAR_SECRET_KEY, catálogo, red).
 */
import { loadRepoEnv } from "../lib/load-repo-env.mjs";
loadRepoEnv();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";
import {
  loadCatalog,
  findService,
  resolveServiceUrl,
} from "../cli/lib/catalog-load.mjs";
import {
  createPaywallHttpClient,
  paywallFetch,
} from "../cli/lib/x402-fetch.mjs";
import { sponsorAgentAccount } from "../shared/trustline.mjs";
import { STELLAR_TESTNET_USDC } from "../lib/stellar-usdc-testnet.mjs";

/**
 * @param {string} url
 * @param {{ method?: string }} [opts]
 */
async function httpCall(url, opts = {}) {
  const method = (opts.method || "GET").toUpperCase();
  const init = {
    method,
    headers: { Accept: "application/json, text/plain;q=0.9,*/*;q=0.8" },
  };
  const secret = process.env.STELLAR_SECRET_KEY?.trim();

  if (secret) {
    const network = process.env.STELLAR_NETWORK === "pubnet" ? "pubnet" : "testnet";
    const httpClient = createPaywallHttpClient(secret, { network });
    return paywallFetch(url, init, { httpClient });
  }

  return fetch(url, init);
}

function summarizeService(s) {
  const tags = s.tags || s.discovery_tags || [];
  return {
    id: s.id,
    name: s.name,
    baseUrl: s.baseUrl,
    description: s.description,
    tags,
    status: s.status,
    paths: s.paths || [],
    pricingNote: s.pricingNote,
    docsUrl: s.docsUrl,
    ...(s.stellarPrerequisites != null
      ? { stellarPrerequisites: s.stellarPrerequisites }
      : {}),
  };
}

function matchesQuery(s, q) {
  if (!q) return true;
  const low = q.toLowerCase();
  const tags = s.tags || s.discovery_tags || [];
  const hay = [
    s.id,
    s.name,
    s.description,
    ...tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(low);
}

const server = new McpServer(
  { name: "pumax402-mcp", version: "0.1.0" },
  {
    instructions:
      "PumaX402: catálogo de servicios x402 en Stellar. Usa list_services para descubrir IDs; si un servicio incluye stellarPrerequisites, ahí va la trustline USDC testnet y plantilla de comando stellar CLI para el usuario/agente. call_service invoca baseUrl+path (HTTP; 402 requiere STELLAR_SECRET_KEY en el entorno MCP). Servicios propios pueden exponer más detalle en GET / sin pago (ej. Agent Pulse → trustlineOnboardingForAgents).",
  }
);

server.registerTool(
  "list_services",
  {
    description:
      "Lista servicios del catálogo PumaX402 (archivo local o AGENTICX402_CATALOG_URL). Opcionalmente filtra por texto en id, nombre, descripción o tags.",
    inputSchema: {
      query: z
        .string()
        .optional()
        .describe("Filtro de texto (opcional); búsqueda case-insensitive."),
    },
  },
  async ({ query }) => {
    const catalog = await loadCatalog();
    const list = (catalog.services || []).filter((s) =>
      matchesQuery(s, query?.trim() || "")
    );
    const payload = {
      version: catalog.version,
      networkDefault: catalog.networkDefault,
      count: list.length,
      services: list.map(summarizeService),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    };
  }
);

server.registerTool(
  "call_service",
  {
    description:
      "GET/POST/… a la URL base del servicio del catálogo + path. Si la respuesta es 402 y no hay STELLAR_SECRET_KEY, el cuerpo lo indica en el JSON devuelto.",
    inputSchema: {
      service_id: z.string().describe("id del servicio en el catálogo (ej. stellar-observatory)."),
      path: z
        .string()
        .describe('Ruta bajo baseUrl, con / inicial (ej. "/v1/foo").'),
      method: z
        .enum(["GET", "POST", "PUT", "PATCH", "DELETE"])
        .optional()
        .describe("Método HTTP (default GET)."),
    },
  },
  async ({ service_id, path, method }) => {
    const catalog = await loadCatalog();
    const service = findService(catalog, service_id);
    const url = resolveServiceUrl(service, path);
    const res = await httpCall(url, { method: method || "GET" });
    const text = await res.text();
    let body;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }

    const payload = {
      url,
      status: res.status,
      statusText: res.statusText,
      body,
    };

    if (res.status === 402 && !process.env.STELLAR_SECRET_KEY?.trim()) {
      payload.hint =
        "402 Payment Required: configura STELLAR_SECRET_KEY (testnet) en el entorno del servidor MCP y reinicia el cliente.";
    }

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    };
  }
);

server.registerTool(
  "get_service_signal",
  {
    description: "Llama internamente a pumax402-stellar-dex-signal y devuelve el JSON del orderbook.",
    inputSchema: {
      selling_code: z.string().optional(),
      buying_code: z.string().optional()
    }
  },
  async ({ selling_code, buying_code }) => {
    const catalog = await loadCatalog();
    const service = findService(catalog, "pumax402-stellar-dex-signal");
    const path = `/v1/signal?selling_code=${selling_code||"USDC"}&buying_code=${buying_code||"EURC"}`;
    const url = resolveServiceUrl(service, path);
    const res = await httpCall(url);
    const text = await res.text();
    return { content: [{ type: "text", text }] };
  }
);

server.registerTool(
  "execute_x402_payment",
  {
    description: "Utilidad que ayuda al agente a construir el auth_entry necesario para el flujo 402 de Stellar.",
    inputSchema: {
      www_authenticate: z.string().describe("Header WWW-Authenticate retornado en caso de 402.")
    }
  },
  async ({ www_authenticate }) => {
    return {
      content: [{ 
        type: "text", 
        text: `Para construir el auth_entry de un error 402 con header '${www_authenticate}':\n1. Parsea el header para extraer 'pay_to' y 'amount'.\n2. Construye una transacción enviando ese amount en el asset acordado hacia 'pay_to' y expide el tx_hash.\n3. Tu auth_entry es el base64 de '{"tx_hash":"tu_hash"}'\n4. Envialo como 'Authorization: L402 <tu_base64>'.`
      }]
    };
  }
);

server.registerTool(
  "check_agent_status",
  {
    description: "Verifica si una cuenta Stellar (G...) existe y si tiene el trustline de USDC testnet habilitado.",
    inputSchema: {
      public_key: z.string().describe("Dirección pública Stellar del agente (G...).")
    }
  },
  async ({ public_key }) => {
    const horizon = process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org";
    try {
      const res = await fetch(`${horizon}/accounts/${public_key}`);
      if (res.status === 404) {
        return {
          content: [{ type: "text", text: JSON.stringify({ exists: false, status: "UNFUNDED", recommendation: "Usa sponsor_agent_account para crearla sin XLM." }, null, 2) }]
        };
      }
      const account = await res.json();
      const hasUsdc = (account.balances || []).some(b => b.asset_code === "USDC");
      return {
        content: [{ type: "text", text: JSON.stringify({ exists: true, trustline_usdc: hasUsdc, balances: account.balances }, null, 2) }]
      };
    } catch (e) {
      return { content: [{ type: "text", text: `Error checking account: ${e.message}` }] };
    }
  }
);

server.registerTool(
  "sponsor_agent_account",
  {
    description: "Genera una transacción XDR pre-firmada por el hub PumaX402 que crea tu cuenta y patrocina tus reservas (sponsored onboarding). Útil para agentes sin XLM en testnet.",
    inputSchema: {
      public_key: z.string().describe("Dirección pública Stellar del agente (G...).")
    }
  },
  async ({ public_key }) => {
    const horizon = process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org";
    const xdr = await sponsorAgentAccount(public_key, "USDC", horizon);
    if (!xdr) {
      return {
        content: [{ type: "text", text: "Error: El hub no tiene configurada SPONSOR_SECRET_KEY o falló la creación del XDR." }]
      };
    }
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({
          instruction: "Transacción de patrocinio generada. Debes añadir la operación 'changeTrust' para USDC y 'endSponsoringFutureReserves', firmarla y enviarla.",
          sponsored_xdr: xdr,
          network: process.env.STELLAR_NETWORK || "testnet",
          asset: STELLAR_TESTNET_USDC
        }, null, 2)
      }]
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("pumax402-mcp stdio listo (PumaX402).");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
