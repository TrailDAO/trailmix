# TrailMix Frontend

A React Native Expo app for discovering and claiming trail tokens through NFT ownership.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React Native components
│   │   ├── Instructions.tsx
│   │   ├── Mint.tsx
│   │   ├── TrailBalance.tsx
│   │   ├── Geolocation.tsx
│   │   ├── Geolocation.web.tsx (web-specific)
│   │   └── index.ts
│   ├── providers/           # Context providers
│   │   ├── Web3Provider.tsx
│   │   ├── Web3Provider.web.tsx (web-specific)
│   │   └── index.ts
│   ├── contracts/           # Smart contract ABIs and addresses
│   │   ├── Addresses.tsx
│   │   ├── Trail.json
│   │   ├── TrailMixNFT.json
│   │   ├── TrailToken.json
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── getAllTrails.ts
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── Trail.tsx
│   │   └── index.ts
│   └── index.ts             # Main exports
├── assets/                  # Static assets
├── App.tsx                  # Main app component
├── index.ts                 # Entry point
├── package.json             # Dependencies and scripts
├── package-lock.json        # Lockfile
├── tsconfig.json            # TypeScript configuration
├── app.json                 # Expo configuration
├── metro.config.js          # Metro bundler configuration
├── polyfills.js             # Browser polyfills
├── env.example              # Environment variables template
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js v22+
- Expo CLI
- MetaMask or compatible wallet

### Installation
```bash
npm install
```

### Development
```bash
# Start development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web
```

### Environment Variables
Create a `.env` file with:
```env
EXPO_PUBLIC_NFT_ADDRESS=your_nft_contract_address
EXPO_PUBLIC_TOKEN_ADDRESS=your_token_contract_address
EXPO_PUBLIC_INFURA_ID=your_infura_project_id
EXPO_PUBLIC_ES_NODE=your_elasticsearch_endpoint
EXPO_PUBLIC_ES_USER=your_elasticsearch_username
EXPO_PUBLIC_ES_PASS=your_elasticsearch_password
```

## 🏗️ Architecture

### Platform-Specific Components
The app uses platform-specific components for optimal experience:
- **Mobile (iOS/Android)**: Full native experience with maps, location services, WalletConnect
- **Web**: Browser-compatible with MetaMask, geolocation API, map placeholders

### Import Structure
Use clean imports from organized folders:
```typescript
import { 
  Mint, 
  TrailBalance, 
  Web3Provider, 
  getAllTrails 
} from './src';
```

### Component Organization
- **Components**: UI components and screens
- **Providers**: React context providers for state management
- **Contracts**: Smart contract ABIs and blockchain addresses
- **Utils**: Pure utility functions
- **Types**: TypeScript type definitions

## 🎨 Styling
- Dark green theme (`#28342e`) matching original design
- White text for contrast on dark backgrounds
- Platform-appropriate UI patterns

## 🔗 Web3 Integration
- **Mobile**: WalletConnect for mobile wallet support
- **Web**: MetaMask integration via window.ethereum
- **Contracts**: ethers.js for blockchain interactions

## 🗺️ Location & Maps
- **Mobile**: React Native Maps with native location services
- **Web**: Browser geolocation with map placeholders
- **Permissions**: Proper permission handling for location access 