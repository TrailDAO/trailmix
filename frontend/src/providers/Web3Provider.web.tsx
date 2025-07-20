import React, { createContext, useContext, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

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
      // Check if MetaMask is installed
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum;
        
        // Request account access
        const accounts = await ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setProvider(ethereum);
          setIsConnected(true);
          
          // Listen for account changes
          ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length > 0) {
              setAddress(accounts[0]);
            } else {
              disconnect();
            }
          });
          
          // Listen for chain changes
          ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        }
      } else {
        Alert.alert('MetaMask Required', 'Please install MetaMask to use this app');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      Alert.alert('Connection Error', 'Failed to connect wallet');
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

// Simple Connect Wallet Component for web
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