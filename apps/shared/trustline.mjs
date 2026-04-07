import * as StellarSdk from "stellar-sdk";

export async function sponsorAgentAccount(clientPublicKey, assetCode, horizonBase) {
  const secret = process.env.SPONSOR_SECRET_KEY?.trim();
  if (!secret) return null;
  
  try {
    const sponsorKeypair = StellarSdk.Keypair.fromSecret(secret);
    const server = new StellarSdk.Server(horizonBase);
    const sponsorAccount = await server.loadAccount(sponsorKeypair.publicKey());
    
    // We construct a sponsored transaction envelope.
    // The agent only needs to append its `changeTrust` and `endSponsoringFutureReserves`,
    // then sign and submit.
    const tx = new StellarSdk.TransactionBuilder(sponsorAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: process.env.STELLAR_NETWORK === "pubnet" ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET,
    })
      .addOperation(StellarSdk.Operation.beginSponsoringFutureReserves({
        sponsoredId: clientPublicKey
      }))
      .addOperation(StellarSdk.Operation.createAccount({
        destination: clientPublicKey,
        startingBalance: "2" // minimal XLM for zero friction
      }))
      .setTimeout(300)
      .build();

    tx.sign(sponsorKeypair);
    return tx.toXDR();
  } catch (err) {
    console.error("Sponsorship error:", err);
    return null;
  }
}

export async function checkTrustline(req, res, next) {
  try {
    const clientAccount = req.get("x-stellar-account") || req.query.client_account;
    if (!clientAccount) {
      return next();
    }

    const horizonBase = process.env.STELLAR_HORIZON_URL?.trim() || 
      (process.env.STELLAR_NETWORK?.trim().toLowerCase() === "pubnet" 
        ? "https://horizon.stellar.org" 
        : "https://horizon-testnet.stellar.org");

    let assetCode = "USDC";
    if (req.query.buying_code) assetCode = req.query.buying_code.toUpperCase();
    if (req.path.includes("risk")) assetCode = "USDC";

    const response = await fetch(`${horizonBase}/accounts/${clientAccount}`);
    if (!response.ok) {
      if (response.status === 404) {
        const sponsoredXdr = await sponsorAgentAccount(clientAccount, assetCode, horizonBase);
        return res.status(402).json({
          error: "payment_required",
          message: "Account unfunded. SPONSORED ONBOARDING AVAILABLE.",
          instruction: `La cuenta ${clientAccount} no existe. Como cortesía, hemos adjuntado una transacción pre-firmada que crea tu cuenta y patrocina tus reservas (beginSponsoringFutureReserves). Adjunta 'changeTrust' para ${assetCode} y 'endSponsoringFutureReserves', firmala y envíala a la red.`,
          sponsored_xdr: sponsoredXdr || undefined
        });
      }
      return next();
    }

    const account = await response.json();
    const balances = account.balances || [];
    const hasTrust = balances.some(b => b.asset_code === assetCode);

    if (!hasTrust) {
      return res.status(402).json({
        error: "payment_required",
        message: `Missing trustline for ${assetCode}`,
        instruction: `Por favor, asegúrate de abrir un trustline (changeTrust) a los emisores de Circle para ${assetCode} antes de solicitar este servicio.`
      });
    }

    next();
  } catch (err) {
    console.error("Trustline Check Error:", err);
    next();
  }
}
