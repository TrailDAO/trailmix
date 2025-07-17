# TrailMix: A Decentralized Social Network for Outdoor Enthusiasts

**TrailMix** is a Web3-powered social platform designed for hikers, wildlife enthusiasts, and conservationists. It combines a decentralized social network with a comprehensive trails database, real-time hiker updates, and gamified incentives to foster community-driven conservation efforts. Built on Ethereum, the app requires users to connect a wallet and mint an entry NFT for access, ensuring a committed user base while enabling token-based rewards. The core token, TRAIL, incentivizes participation, content creation, and real-world contributions to trails and conservation.

The app emphasizes decentralization: user data and interactions are stored on-chain where possible (e.g., via IPFS for profiles and posts), with off-chain elements for scalability (e.g., real-time messaging via WebSockets or decentralized protocols like Whisper). Smart contracts handle NFT minting, token distribution, and governance, promoting transparency and user ownership.

## Key Principles
- **Community Focus**: Users share trail conditions, wildlife sightings, and conservation tips in real-time.
- **Incentivization**: TRAIL tokens reward active participation, with game theory mechanics to encourage sustainable behaviors like trail maintenance and donations.
- **Accessibility with Barriers**: NFT-gated entry filters casual users, building a dedicated community while generating initial revenue.
- **Sustainability**: Integrate oracle feeds for real-world data (e.g., weather APIs) and tie rewards to verifiable conservation actions.

## User Onboarding and Access Control

1. **Wallet Connection**:
   - Users connect an Ethereum-compatible wallet (e.g., MetaMask, WalletConnect) via the frontend.
   - Supported networks: Ethereum Mainnet for production; Sepolia or Goerli for testing.
   - Upon connection, the app queries the wallet for existing NFTs. If none, prompt for minting.

2. **NFT Minting**:
   - **Entry NFT**: A non-fungible token (ERC-721 standard) representing membership. Minting fee: Fixed ETH amount (e.g., 0.05 ETH) to fund development and conservation donations.
   - **Smart Contract**: Deploy an ERC-721 contract with metadata stored on IPFS (e.g., user-chosen avatar, bio snippet). Include soulbound traits to prevent resale, ensuring long-term commitment.
   - **Process**:
     - User approves transaction.
     - Contract mints NFT and assigns it to the wallet.
     - Post-mint: Grant access token (JWT-like, signed by contract) for session-based authentication.
   - **Upgrades**: Users can "level up" NFTs by earning TRAIL tokens, unlocking badges for achievements (e.g., "Trail Guardian" for conservation contributions).

3. **Authentication Flow**:
   - Frontend verifies NFT ownership via contract calls (e.g., `balanceOf` or `ownerOf`).
   - Fallback: If wallet disconnects, require re-connection; use SIWE (Sign-In with Ethereum) for secure sessions.

## Core Features

### 1. Social Network Components
- **User Profiles**: Decentralized profiles stored on IPFS, linked to wallet address. Include bio, favorite trails, badges from NFT upgrades, and social links. Users can follow others, forming a graph stored in a smart contract (e.g., ERC-1155 for multi-follows).
- **Posting and Interactions**: Users create posts (text, images, videos) about trails, wildlife, or events. Posts are stored on IPFS with hashes on-chain for immutability. Interactions (likes, comments, shares) trigger token rewards.
- **Feeds**: Algorithmic feeds based on follows, location, and interests. Use off-chain indexing (e.g., The Graph) for efficient querying.

### 2. Trails Database
- **Structure**: A decentralized database of trails, crowdsourced by users. Use a smart contract (ERC-20 extension or custom) to store trail metadata (name, location, difficulty, length, wildlife notes) as structs.
- **Data Sources**:
  - Initial seeding: Import open datasets (e.g., from AllTrails API or OSM) via oracles.
  - User Contributions: Allow edits/votes on trail info, with token stakes for accuracy (see Game Theory below).
- **Querying**: Frontend uses Web3.js to query contract for trails by filters (e.g., location via geohash, difficulty). Integrate with mapping libraries like Leaflet for visual display.
- **Storage Optimization**: Heavy data (maps, photos) on IPFS/Swarm; light metadata on-chain.

### 3. Real-Time Hiker Information
- **Live Updates**: Peer-to-peer sharing of trail conditions (e.g., weather, hazards, sightings) via decentralized messaging.
  - Implementation: Use Ethereum's Whisper protocol or integrate with XMTP (Xmtp.org) for wallet-based chat.
  - Channels: Location-based rooms (e.g., "Yosemite Trail Chat") or global forums.
- **Notifications**: Push alerts via wallet providers or off-chain services like Push Protocol for new updates in followed trails.
- **Integration**: Combine with oracles (e.g., Chainlink) for external data like real-time weather or satellite imagery for trail status.

## Token Economy: TRAIL Token

**TRAIL** is an ERC-20 utility token designed to incentivize engagement and fund conservation.

- **Total Supply**: Fixed at 1 billion tokens (e.g., 50% for rewards, 20% treasury, 15% team/DAO, 10% liquidity, 5% initial airdrop to early NFT minters).
- **Distribution Mechanisms**:
  - **Usage Rewards**: Earn TRAIL for daily logins, posts, comments (e.g., 1-5 TRAIL per action, capped daily to prevent spam).
  - **Content Curation**: Upvotes/downvotes on posts/trail updates stake TRAIL; accurate contributions yield bonuses.
  - **Milestones**: Badges for achievements (e.g., 100 posts = 100 TRAIL).
  - **Liquidity**: Provide TRAIL/ETH pairs on Uniswap for trading.

- **Utility**:
  - Spend TRAIL on premium features (e.g., ad-free feeds, custom NFT traits).
  - Stake for governance votes (e.g., propose new trails or app features).
  - Donate to conservation: Convert TRAIL to ETH for real-world causes via DAO treasury.

- **Smart Contract Setup**:
  - Minting contract with emission schedule (e.g., halving every year).
  - Reward distributor: A separate contract that verifies actions (e.g., via event logs) and dispenses tokens.

| Token Allocation | Percentage | Purpose |
|------------------|------------|---------|
| User Rewards | 50% | Incentivize posts, updates, and interactions |
| Treasury/DAO | 20% | Fund development and conservation grants |
| Team/Advisors | 15% | Vested over 2 years for sustainability |
| Liquidity Pools | 10% | Bootstrap trading on DEXes |
| Airdrops/Early Users | 5% | Reward NFT minters and beta testers |

## Game Theory Mechanisms for Contributions

To encourage "giving back," incorporate mechanisms inspired by token-curated registries and proof-of-contribution models, ensuring users act in the community's interest.

1. **Staking for Accuracy**:
   - Users stake TRAIL when submitting trail updates or edits. If challenged and proven wrong (via community vote), stake is slashed and redistributed. If accurate, staker earns bonus TRAIL.
   - **Rationale**: Discourages misinformation; Nash equilibrium favors honest reporting as slashing risk outweighs potential gains from falsehoods.

2. **Proof-of-Action Rewards**:
   - Verifiable contributions: Users upload geo-tagged photos/videos of trail maintenance (e.g., trash cleanup) via IPFS. Community or oracles (e.g., Chainlink VRF for random audits) verify, rewarding TRAIL.
   - **Game Element**: Leaderboards for top contributors; top 10 monthly get NFT upgrades or token multipliers.
   - **Rationale**: Creates a positive-sum game where individual efforts benefit the collective, with reputation as a non-transferable asset.

3. **Governance and Proposals**:
   - DAO structure: NFT holders stake TRAIL to vote on app improvements or conservation funding (e.g., "Donate 10k TRAIL to national parks").
   - **Quadratic Voting**: Use TRAIL stakes with quadratic scaling to amplify small holders' voices, preventing whale dominance.
   - **Rationale**: Aligns incentives with long-term value; users are motivated to participate to influence outcomes affecting their rewards.

4. **Deflationary Pressures**:
   - Burn a portion of transaction fees (e.g., 1% on token transfers) to reduce supply, increasing value for holders who contribute.
   - **Anti-Sybil**: Limit rewards per wallet; require NFT holding time for multipliers.

These mechanics draw from successful models like Gitcoin (quadratic funding) and Ocean Protocol (data curation), ensuring emergent behaviors promote conservation without central enforcement.

## Technical Architecture

- **Frontend**: React.js or Next.js with Web3 libraries (ethers.js, wagmi). Mobile support via Progressive Web App (PWA).
- **Backend/Decentralized Layer**:
  - Smart Contracts: Solidity on Ethereum; use OpenZeppelin for standards (ERC-721, ERC-20).
  - Storage: IPFS for files; The Graph for indexing events.
  - Oracles: Chainlink for external data feeds (weather, verifications).
  - Real-Time: WebSockets fallback or decentralized alternatives like GunDB.
- **Deployment**:
  - Contracts: Deploy via Hardhat/Truffle; audit with tools like Slither.
  - Hosting: Vercel for frontend; Pinata for IPFS pinning.
- **Integration Flow**:
  - User action → Frontend → Contract call → Event emission → Indexer update → UI refresh.

## Security, Privacy, and Scalability

- **Security**: 
  - Audit contracts for reentrancy, overflow. Use multisig for treasury.
  - Frontend: Sanitize inputs; use HTTPS and wallet signatures.
- **Privacy**: Wallet addresses are pseudonymous; optional zero-knowledge proofs (e.g., Semaphore) for anonymous posts.
- **Scalability**: Layer-2 solutions (e.g., Optimism) for cheaper transactions. Off-chain compute for heavy queries.
- **Compliance**: Ensure NFT minting complies with KYC if needed; token not marketed as investment.
  
