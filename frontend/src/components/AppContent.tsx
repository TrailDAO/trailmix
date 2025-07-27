import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAccount, useReadContract } from 'wagmi';
import { AppKitButton } from '@traildao/appkit-wagmi-react-native';
import Mint from './Mint';
import TrailNFCVerifier from './TrailNFCVerifier';
import TrailBalance from './TrailBalance';
import Instructions from './Instructions';
import { TrailMixNFTAddress, TrailMixNFT } from '../contracts';

export default function AppContent() {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TrailBalance address={address} />
        <AppKitButton />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>TrailMix 🥾⛰️ </Text>

        {ownsNFT ? (
          <TrailNFCVerifier address={address} />
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
