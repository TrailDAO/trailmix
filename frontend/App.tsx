import "@walletconnect/react-native-compat";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { WagmiProvider, useAccount, useReadContract } from "wagmi";
import { mainnet, polygon, arbitrum } from "@wagmi/core/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createAppKit,
  defaultWagmiConfig,
  AppKit,
} from "@traildao/appkit-wagmi-react-native";
import React, { useEffect, useState } from "react";
import {
  ConnectWallet,
  Mint,
  Geolocation,
  TrailBalance,
  Instructions,
  TrailMixNFTAddress,
  TrailMixNFT
} from './src';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://dashboard.reown.com
const projectId = "0ae0a5c224a577e8ca207e40a3fbdc4d";

// 2. Create config
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

const chains = [mainnet, polygon, arbitrum] as const;

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createAppKit({
  projectId,
  wagmiConfig,
  defaultChain: mainnet, // Optional
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  metadata,
});

export default function App() {
  const { address } = useAccount();
  const [ownsNFT, setOwnsNFT] = useState(false);

  const { data: balance, error } = useReadContract({
    address: TrailMixNFTAddress as `0x${string}`,
    abi: TrailMixNFT.abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address, // Only run when address exists
    }
  });

  useEffect(() => {
    if (balance !== undefined) {
      setOwnsNFT(Number(balance) > 0);
    }
    if (error) {
      console.error("Error checking NFT ownership:", error);
    }
  }, [balance, error]);


  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TrailBalance />
          <ConnectWallet style={styles.connectWallet} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>TrailMix 🥾⛰️ </Text>

          {ownsNFT ? (
            <Geolocation />
          ) : address ? (
            <Mint
              afterMint={() => setOwnsNFT(true)}
            />
          ) : (
            <Instructions />
          )}
        </View>

      <StatusBar style="auto" />
    </SafeAreaView>
        <AppKit />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#28342e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#28342e',
    borderBottomWidth: 1,
    borderBottomColor: '#3a4a44',
  },
  connectWallet: {
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
});
