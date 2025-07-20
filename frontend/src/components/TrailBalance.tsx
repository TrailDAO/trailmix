import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { TrailTokenAddress, TrailToken } from '../contracts';
import { ethers } from 'ethers';

interface TrailBalanceProps {
  address?: string;
  provider?: any;
}

function TrailBalance({ address, provider }: TrailBalanceProps) {
  const [trailBalance, setTrailBalance] = useState("0.0");

  useEffect(() => {
    const getTrailBalance = async () => {
      if (provider && address) {
        try {
          const token = new ethers.Contract(TrailTokenAddress, TrailToken.abi, provider.getSigner());
          const balance = await token.balanceOf(address);
          if (balance) {
            setTrailBalance(ethers.utils.formatEther(balance));
          }
        } catch (error) {
          console.error("Error fetching trail balance:", error);
        }
      }
    };
    getTrailBalance();
  }, [address, provider]);

  if (!address) {
    return null;
  }

  return (
    <View>
      <Text>🏕️ TRAIL {trailBalance}</Text>
    </View>
  );
}

export default TrailBalance; 