# TrailMix Contracts Deployment Guide

This guide explains how to deploy your TrailMix smart contracts using [Foundry (Forge)](https://book.getfoundry.sh/).

---

## 1. Environment Setup

1. **Copy and edit your environment file:**
   ```bash
   cd trailmix/contracts
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Set the following variables in `.env`:**

   ```env
   # RPC URLs - Mainnets
   ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
   OPTIMISM_RPC_URL=https://mainnet.optimism.io

   # RPC URLs - Testnets
   ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
   OPTIMISM_SEPOLIA_RPC_URL=https://sepolia.optimism.io
   ARBITRUM_GOERLI_RPC_URL=https://goerli-rollup.arbitrum.io/rpc

   # API Keys
   ARBISCAN_API_KEY=your_arbiscan_api_key_here
   OPTIMISTIC_ETHERSCAN_API_KEY=your_optimistic_etherscan_api_key_here

   # Private Keys (for deployment)
   PRIVATE_KEY=your_private_key_here
   DEPLOYER_ADDRESS=your_deployer_address_here

   # Contract Parameters
   NFT_NAME=TrailMix Membership
   NFT_SYMBOL=TRAIL
   TOKEN_NAME=Trail Token
   TOKEN_SYMBOL=TRAIL
   INITIAL_MINT_PRICE=50000000000000000  # 0.05 ETH
   ```

3. **Get testnet ETH:**
   - [Arbitrum Sepolia Faucet](https://sepoliafaucet.com/)
   - [Optimism Sepolia Faucet](https://community.optimism.io/docs/useful-tools/faucets/)

---

## 2. Build & Test

```bash
forge build
forge test
```

---

## 3. Deploying Contracts

### **Using RPC URLs (direct):**

```bash
# Deploy to Arbitrum Sepolia
forge script script/Deploy.s.sol:DeployScript --rpc-url $ARBITRUM_SEPOLIA_RPC_URL --broadcast --verify -vvvv

# Deploy to Optimism Sepolia
forge script script/Deploy.s.sol:DeployScript --rpc-url $OPTIMISM_SEPOLIA_RPC_URL --broadcast --verify -vvvv
```

### **Using Foundry Profiles:**

You can also use profiles defined in `foundry.toml`:

```bash
forge script script/Deploy.s.sol:DeployScript --profile arbitrum_sepolia --broadcast --verify -vvvv
forge script script/Deploy.s.sol:DeployScript --profile optimism_sepolia --broadcast --verify -vvvv
```

### **For Mainnet:**

```bash
forge script script/Deploy.s.sol:DeployScript --profile arbitrum --broadcast --verify -vvvv
forge script script/Deploy.s.sol:DeployScript --profile optimism --broadcast --verify -vvvv
```

---

## 4. What the Deployment Script Does

- Deploys `TrailToken`
- Deploys `TrailMixNFT` (linked to `TrailToken`)
- Deploys `TrailProofReward`
- Sets NFT as token minter
- Outputs all contract addresses

---

## 5. After Deployment

1. **Copy the deployed contract addresses** from the Forge output.
2. **Update your frontend `.env`**:
   ```env
   EXPO_PUBLIC_NFT_ADDRESS=0x...
   EXPO_PUBLIC_TOKEN_ADDRESS=0x...
   EXPO_PUBLIC_PROOF_ADDRESS=0x...
   ```
3. **Verify contracts** (if not auto-verified):
   ```bash
   forge verify-contract <CONTRACT_ADDRESS> <CONTRACT_NAME> --chain-id <CHAIN_ID>
   ```

---

## 6. Troubleshooting

- Make sure your `.env` is correct and not checked into version control!
- Ensure your deployer wallet has enough ETH for gas.
- If you see errors about missing keys, double check your `.env` and `foundry.toml`.

---

## 7. Quick Reference

```bash
# 1. Build & test
forge build && forge test

# 2. Deploy to testnet
forge script script/Deploy.s.sol:DeployScript --profile arbitrum_sepolia --broadcast --verify -vvvv
```

---

Happy shipping! 🚀
