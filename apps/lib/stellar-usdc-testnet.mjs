/**
 * USDC en Stellar **testnet** (Circle). Misma referencia que x402 / quickstart.
 * @see https://developers.circle.com/stablecoins/usdc-contract-addresses
 */
export const STELLAR_TESTNET_USDC = Object.freeze({
  assetCode: "USDC",
  issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
  referenceUrl: "https://developers.circle.com/stablecoins/usdc-contract-addresses",
  x402QuickstartUrl:
    "https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide",
});

/** Línea de confianza clásica `CODE:ISSUER` para Stellar CLI / APIs. */
export function usdcTestnetTrustLine() {
  return `${STELLAR_TESTNET_USDC.assetCode}:${STELLAR_TESTNET_USDC.issuer}`;
}

/**
 * Texto y comando listo para onboarding de agentes / humanos.
 * @param {{ payToHint?: string }} [opts]
 */
export function agentTrustlineOnboarding(opts = {}) {
  const line = usdcTestnetTrustLine();
  const payTo = opts.payToHint?.trim();
  return {
    network: "stellar:testnet",
    summary:
      "Antes de pagar o recibir USDC en x402 Exact testnet, cada cuenta Stellar necesita una trustline a USDC con el emisor de testnet de Circle.",
    trustlines: [
      {
        asset: STELLAR_TESTNET_USDC.assetCode,
        issuer: STELLAR_TESTNET_USDC.issuer,
        line,
        appliesTo: payTo
          ? [
              "Cuenta pagadora (STELLAR_SECRET_KEY / cliente x402)",
              `Cuenta receptora payTo: ${payTo.slice(0, 12)}…`,
            ]
          : ["Cuenta pagadora", "Cuenta receptora (payTo) del servicio"],
      },
    ],
    stellarCli: {
      note:
        "Sustituye <SOURCE> por el alias de stellar keys, la G… o la S… de la cuenta que abre la trustline.",
      changeTrust: `stellar network use testnet && stellar tx new change-trust --source <SOURCE> --line ${line}`,
    },
    obtainTestUsdc: {
      circleFaucet: "https://faucet.circle.com/",
      docs: STELLAR_TESTNET_USDC.x402QuickstartUrl,
    },
    references: [STELLAR_TESTNET_USDC.referenceUrl],
  };
}
