import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ethers } from 'ethers';

import { Web3Provider, useWeb3, ConnectWallet } from './Web3Provider';
import Mint from './Mint';
import Geolocation from './Geolocation';
import TrailBalance from './TrailBalance';
import Instructions from './Instructions';
import { TrailMixNFTAddress, TrailMixNFT } from './Addresses';

function AppContent() {
  const { address, provider } = useWeb3();
  const [ownsNFT, setOwnsNFT] = useState(false);

  useEffect(() => {
    const checkNFTOwner = async () => {
      if (provider && address) {
        try {
          const nftContract = new ethers.Contract(TrailMixNFTAddress, TrailMixNFT.abi, provider.getSigner());
          const balance = await nftContract.balanceOf(address);
          if (balance > 0) {
            setOwnsNFT(true);
          }
        } catch (error) {
          console.error("Error checking NFT ownership:", error);
        }
      }
    };
    checkNFTOwner();
  }, [address, provider]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TrailBalance address={address} provider={provider} />
        <ConnectWallet style={styles.connectWallet} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>TrailMix 🥾⛰️</Text>
        
        {ownsNFT ? (
          <Geolocation address={address} provider={provider} />
        ) : address ? (
          <Mint 
            address={address} 
            provider={provider} 
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
  },
});
