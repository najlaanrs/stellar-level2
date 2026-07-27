#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String, Vec};

#[test]
fn test_poll() {
    let env = Env::default();
    let contract_id = env.register_contract(None, LivePollContract);
    let client = LivePollContractClient::new(&env, &contract_id);

    let question = String::from_str(&env, "Favorite color?");
    let mut options = Vec::new(&env);
    options.push_back(String::from_str(&env, "Red"));
    options.push_back(String::from_str(&env, "Blue"));

    client.init(&question, &options);

    let voter1 = Address::generate(&env);
    client.mock_all_auths().vote(&voter1, &0);

    let (q, opts, votes) = client.get_poll();
    assert_eq!(q, question);
    assert_eq!(opts, options);
    assert_eq!(votes.get(0).unwrap(), 1);
    assert_eq!(votes.get(1).unwrap(), 0);
    
    // Test double voting
    let res = client.try_vote(&voter1, &1);
    assert!(res.is_err());
    
    // Test invalid option
    let voter2 = Address::generate(&env);
    let res2 = client.try_vote(&voter2, &99);
    assert!(res2.is_err());
}
