import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrailTokenAddress, TrailToken } from '../config';
import { useReadContract, useAccount } from 'wagmi';
import { formatEther } from 'viem';

function TrailBalance() {
  const { address } = useAccount();
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
      <Text style={styles.text}>🏕️ TRAIL {trailBalance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TrailBalance;