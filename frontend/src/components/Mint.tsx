import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TrailMixNFTAddress, TrailMixNFT } from '../config';
import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';

interface MintProps {
  afterMint: () => void;
}

function Mint({ afterMint }: MintProps) {
  const [isMinting, setIsMinting] = useState(false);
  const { address } = useAccount();

  // Read mint price from contract
  const { data: mintPriceData } = useReadContract({
    address: TrailMixNFTAddress as `0x${string}`,
    abi: TrailMixNFT.abi,
    functionName: 'mintPrice',
  });

  const mintPrice = mintPriceData ? formatEther(mintPriceData as bigint) : "0.05";

  // Contract write hook for minting
  const { data: mintData, writeContract: mintNFT } = useWriteContract();

  // Wait for transaction confirmation
  const { 
    data: receipt, 
    isLoading: isWaitingForTransaction, 
    error: transactionError 
  } = useWaitForTransactionReceipt({
    hash: mintData,
  });

  // Handle transaction success/error
  useEffect(() => {
    if (receipt) {
      setIsMinting(false);
      afterMint();
      Alert.alert("Success", "NFT minted successfully!");
    }
  }, [receipt, afterMint]);

  useEffect(() => {
    if (transactionError) {
      setIsMinting(false);
      console.error("Transaction failed:", transactionError);
      Alert.alert("Error", "Transaction failed");
    }
  }, [transactionError]);

  const mint = async () => {
    console.log("Minting for address", address);

    if (!address) {
      Alert.alert("Error", "Please connect your wallet first");
      return;
    }

    setIsMinting(true);

    try {
      mintNFT({
        address: TrailMixNFTAddress as `0x${string}`,
        abi: TrailMixNFT.abi,
        functionName: 'mint',
        args: [],
        value: mintPriceData ? mintPriceData as bigint : parseEther("0.05"),
      });
    } catch (error) {
      console.error("Error initiating mint:", error);
      Alert.alert("Error", "Failed to initiate mint");
      setIsMinting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mint an NFT to claim 🏕️ TRAIL</Text>
      <Text style={styles.text}>Mint price {mintPrice} Ξ</Text>
      <TouchableOpacity 
        style={[styles.button, isMinting && styles.buttonDisabled]} 
        onPress={mint}
        disabled={isMinting || isWaitingForTransaction || !address}
      >
        <Text style={styles.buttonText}>
          {isMinting || isWaitingForTransaction ? "Minting..." : "Mint"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  button: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Mint; 