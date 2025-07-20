import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ethers } from 'ethers';
import { TrailMixNFTAddress, TrailMixNFT } from './Addresses';

interface MintProps {
  address?: string;
  provider?: any;
  afterMint: () => void;
}

function Mint({ address, provider, afterMint }: MintProps) {
  const [mintPrice, setMintPrice] = useState("0.05");
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    const getMintPrice = async () => {
      if (provider) {
        try {
          const nftContract = new ethers.Contract(TrailMixNFTAddress, TrailMixNFT.abi, provider.getSigner());
          const mintPrice = await nftContract.mintPrice();
          if (mintPrice) {
            setMintPrice(ethers.utils.formatEther(mintPrice));
          }
        } catch (error) {
          console.error("Error fetching mint price:", error);
        }
      }
    };
    getMintPrice();
  }, [provider]);

  const mint = async () => {
    console.log("Minting for address", address);

    if (!provider) {
      Alert.alert("Error", "No provider available");
      return;
    }

    setIsMinting(true);

    try {
      const nftContract = new ethers.Contract(TrailMixNFTAddress, TrailMixNFT.abi, provider.getSigner());
      const tx = await nftContract.mint({ value: ethers.utils.parseEther(mintPrice) });
      await tx.wait();
      
      afterMint();
      Alert.alert("Success", "NFT minted successfully!");
    } catch (error) {
      console.error("Error minting:", error);
      Alert.alert("Error", "Failed to mint NFT");
    } finally {
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
        disabled={isMinting}
      >
        <Text style={styles.buttonText}>
          {isMinting ? "Minting..." : "Mint"}
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