import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';

interface Web3ContextType {
  address?: string;
  provider?: any;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
});

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [address, setAddress] = useState<string>();
  const [provider, setProvider] = useState<any>();
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      // Create WalletConnect Provider
      const walletConnectProvider = new WalletConnectProvider({
        infuraId: process.env.EXPO_PUBLIC_INFURA_ID || '', // Required
        rpc: {
          1: `https://mainnet.infura.io/v3/${process.env.EXPO_PUBLIC_INFURA_ID}`,
          // Add other networks as needed
        },
      });

      // Enable session (triggers QR Code modal)
      await walletConnectProvider.enable();

      // Create ethers provider
      const ethersProvider = new ethers.providers.Web3Provider(walletConnectProvider);
      const signer = ethersProvider.getSigner();
      const address = await signer.getAddress();

      setProvider(ethersProvider);
      setAddress(address);
      setIsConnected(true);

      // Subscribe to events
      walletConnectProvider.on('accountsChanged', (accounts: string[]) => {
        setAddress(accounts[0]);
      });

      walletConnectProvider.on('chainChanged', (chainId: number) => {
        console.log('Chain changed to:', chainId);
      });

      walletConnectProvider.on('disconnect', (code: number, reason: string) => {
        console.log('Disconnected:', code, reason);
        disconnect();
      });

    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnect = () => {
    setProvider(undefined);
    setAddress(undefined);
    setIsConnected(false);
  };

  return (
    <Web3Context.Provider value={{ address, provider, connect, disconnect, isConnected }}>
      {children}
    </Web3Context.Provider>
  );
}

// Simple Connect Wallet Component
interface ConnectWalletProps {
  style?: any;
}

export function ConnectWallet({ style }: ConnectWalletProps) {
  const { address, connect, disconnect, isConnected } = useWeb3();

  return (
    <TouchableOpacity 
      style={[styles.connectButton, style]} 
      onPress={isConnected ? disconnect : connect}
    >
      <Text style={styles.connectButtonText}>
        {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
      </Text>
    </TouchableOpacity>
  );
}

import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  connectButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  connectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 