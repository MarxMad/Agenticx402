#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Limit,           // i128 (Total allowed per day)
    SpentToday,      // i128
    LastReset,       // u64 (Timestamp de medianoche o similar)
}

#[contract]
pub struct SpendingLimit;

const DAY_IN_SECONDS: u64 = 86400;

#[contractimpl]
impl SpendingLimit {
    /// Configura el administrador y el límite diario (en unidades base del activo).
    pub fn initialize(env: Env, admin: Address, daily_limit: i128) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Limit, &daily_limit);
        env.storage().instance().set(&DataKey::SpentToday, &0i128);
        env.storage().instance().set(&DataKey::LastReset, &env.ledger().timestamp());
    }

    /// Intenta gastar una cantidad. Lanza pánico si excede el límite diario.
    /// Útil para que un agente lo llame antes de autorizar un pago x402.
    pub fn withdraw_checked(env: Env, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let now = env.ledger().timestamp();
        let mut last_reset: u64 = env.storage().instance().get(&DataKey::LastReset).unwrap();
        let mut spent_today: i128 = env.storage().instance().get(&DataKey::SpentToday).unwrap();
        let limit: i128 = env.storage().instance().get(&DataKey::Limit).unwrap();

        // Si ha pasado más de un día, reseteamos el contador
        if now >= last_reset + DAY_IN_SECONDS {
            spent_today = 0;
            last_reset = now;
            env.storage().instance().set(&DataKey::LastReset, &last_reset);
        }

        let new_total = spent_today + amount;
        if new_total > limit {
            panic!("Daily spending limit exceeded");
        }

        env.storage().instance().set(&DataKey::SpentToday, &new_total);
    }

    pub fn get_remaining_limit(env: Env) -> i128 {
        let limit: i128 = env.storage().instance().get(&DataKey::Limit).unwrap();
        let spent_today: i128 = env.storage().instance().get(&DataKey::SpentToday).unwrap();
        limit - spent_today
    }
}
