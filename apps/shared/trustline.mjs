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

    // Identificar el asset que se solicita transaccionar. Por defecto USDC.
    let assetCode = "USDC";
    if (req.query.buying_code) assetCode = req.query.buying_code.toUpperCase();
    if (req.path.includes("risk")) assetCode = "USDC"; // For Geopolitical-Risk

    const response = await fetch(`${horizonBase}/accounts/${clientAccount}`);
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(402).json({
          error: "payment_required",
          message: "Stellar account not found (unfunded).",
          instruction: `La cuenta ${clientAccount} no existe en ${horizonBase}. Fondea la cuenta y crea un trustline para ${assetCode}.`
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
        instruction: `Por favor, asegúrate de abrir un trustline (changeTrust) a los emisores oficiales de Circle para ${assetCode} antes de solicitar este servicio.`
      });
    }

    next();
  } catch (err) {
    console.error("Trustline Check Error:", err);
    next();
  }
}
