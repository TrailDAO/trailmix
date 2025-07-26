.PHONY: frontend-dev frontend-install frontend-build contracts-prepare contracts-build contracts-test contracts-deploy-arbitrum contracts-deploy-optimism help

# Default target
help:
	@echo "Available targets:"
	@echo "  frontend-dev              - Start frontend development server"
	@echo "  frontend-install          - Install dependencies for frontend"
	@echo "  frontend-build            - Build frontend for production"
	@echo "  contracts-prepare         - Prepare smart contracts with Forge"
	@echo "  contracts-build           - Build smart contracts with Forge"
	@echo "  contracts-test            - Run smart contract tests"
	@echo "  contracts-deploy-arbitrum - Deploy contracts to Arbitrum"
	@echo "  contracts-deploy-optimism - Deploy contracts to Optimism"

# Frontend targets
frontend-dev:
	cd frontend && npm start

frontend-install:
	cd frontend && npm ci

frontend-build:
	cd frontend && npm run build

# Contract targets
contracts-prepare:
	cd contracts && forge install OpenZeppelin/openzeppelin-contracts

contracts-build:
	cd contracts && forge build && cd .. && ./copy_abi.sh

contracts-test:
	cd contracts && forge test

contracts-deploy-arbitrum:
	cd contracts && forge script script/Deploy.s.sol --rpc-url $(ARBITRUM_RPC_URL) --broadcast --verify

contracts-deploy-optimism:
	cd contracts && forge script script/Deploy.s.sol --rpc-url $(OPTIMISM_RPC_URL) --broadcast --verify
