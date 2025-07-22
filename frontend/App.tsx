import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useReadContract, useAccount } from 'wagmi';

import { 
  Web3Provider, 
  ConnectWallet,
  Mint,
  Geolocation,
  TrailBalance,
  Instructions,
  TrailMixNFTAddress,
  TrailMixNFT
} from './src';

function AppContent() {
  const { address } = useAccount();
  const [ownsNFT, setOwnsNFT] = useState(false);

  // Use wagmi hook at component level
  const { data: balance, error } = useReadContract({
    address: TrailMixNFTAddress as `0x${string}`,
    abi: TrailMixNFT.abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address, // Only run when address exists
    }
  });

  // Update ownsNFT state when balance changes
  useEffect(() => {
    if (balance !== undefined) {
      setOwnsNFT(Number(balance) > 0);
    }
    if (error) {
      console.error("Error checking NFT ownership:", error);
    }
  }, [balance, error]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TrailBalance />
        <ConnectWallet style={styles.connectWallet} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>TrailMix 🥾⛰️</Text>
        
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
  );
}

export default function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
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
