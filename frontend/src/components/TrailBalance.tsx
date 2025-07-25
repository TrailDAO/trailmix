import React from 'react';
import { View, Text } from 'react-native';
import { TrailTokenAddress, TrailToken } from '../contracts';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';

interface TrailBalanceProps {
  address?: string;
}

function TrailBalance({ address }: TrailBalanceProps) {
  // Read TRAIL token balance using wagmi
  const { data: balanceData } = useReadContract({
    address: TrailTokenAddress as `0x${string}`,
    abi: TrailToken.abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  const trailBalance = balanceData ? formatEther(balanceData as bigint) : "0.0";

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