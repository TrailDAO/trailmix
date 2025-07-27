import "@walletconnect/react-native-compat";
import { WagmiProvider } from "wagmi";
import { arbitrum, optimism, arbitrumSepolia, optimismSepolia } from "@wagmi/core/chains";
import { injected } from "@wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createAppKit,
  defaultWagmiConfig,
  AppKit,
} from "@traildao/appkit-wagmi-react-native";
import { AppContent } from './src';
import { projectId } from './src/config';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Create config
const metadata = {
  name: "Trailmix",
  description: "Trailmix AppKit RN Example",
  url: "http://localhost:8081",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
  redirect: {
    native: "trailmix://",
    universal: "trailmix.eco",
  },
};

const chains = [arbitrum, optimism, arbitrumSepolia, optimismSepolia] as const;

const wagmiConfig = defaultWagmiConfig({ 
  chains, 
  projectId, 
  metadata, 
  connectors: [
    injected()
  ] 
});

// 3. Create modal
createAppKit({
  projectId,
  wagmiConfig,
  defaultChain: arbitrumSepolia, // Optional
  enableAnalytics: false, // Enable this later
  metadata,
});

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <AppKit />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
