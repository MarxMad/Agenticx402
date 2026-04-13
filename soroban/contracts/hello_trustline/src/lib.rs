#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    USDC,
}

#[contract]
pub struct HelloTrustline;

#[contractimpl]
impl HelloTrustline {
    /// Inicia el contrato con un administrador y el ID del contrato SAC de USDC.
    /// Sigue el patrón '__constructor' de Soroban Protocol 22+.
    pub fn __constructor(env: Env, admin: Address, usdc_contract: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::USDC, &usdc_contract);
    }

    /// Devuelve un saludo indicando que el contrato está listo para x402.
    pub fn hello(env: Env) -> Symbol {
        symbol_short!("x402Ready")
    }

    /// Obtiene la dirección de USDC configurada.
    pub fn get_usdc(env: Env) -> Address {
        env.storage().instance().get(&DataKey::USDC).unwrap()
    }
}
