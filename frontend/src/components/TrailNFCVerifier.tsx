import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useWriteContract, useAccount } from 'wagmi';
import { keccak256, stringToBytes } from 'viem';
import { TrailProofRewardAddress, TrailProofReward } from '../config';

function TrailNFCVerifier() {
  const { address } = useAccount();
  const { writeContract: claimReward, isPending } = useWriteContract();
  const [nfcInput, setNfcInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Convert string input to bytes32 hash
  const stringToBytes32 = (str: string): string => {
    return keccak256(stringToBytes(str));
  };

  const handleNFCScan = async () => {
    setIsScanning(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // For React Native, you would typically use a library like react-native-nfc-manager
      // This is a placeholder implementation
      Alert.alert(
        "NFC Scan",
        "NFC scanning would be implemented with react-native-nfc-manager. For now, please enter the trail code manually.",
        [{ text: "OK", onPress: () => setIsScanning(false) }]
      );
    } catch (error) {
      console.error('NFC scan error:', error);
      setErrorMsg('NFC scanning failed. Please enter the trail code manually.');
      setIsScanning(false);
    }
  };

  const claimTrailReward = async () => {
    if (!address) {
      Alert.alert("Error", "No wallet connected");
      return;
    }

    if (!nfcInput.trim()) {
      setErrorMsg('Please enter a trail code or scan an NFC tag');
      return;
    }

    try {
      setErrorMsg('');
      setSuccessMsg('');
      
      const nfcHash = stringToBytes32(nfcInput.trim());
      
      await claimReward({
        address: TrailProofRewardAddress as `0x${string}`,
        abi: TrailProofReward.abi,
        functionName: 'claim',
        args: [nfcHash],
      });
      
      setSuccessMsg('Trail reward claimed successfully!');
      setNfcInput('');
    } catch (error: any) {
      console.error("Error claiming reward:", error);
      let errorMessage = 'Failed to claim reward';
      
      if (error.message?.includes('Invalid NFC data')) {
        errorMessage = 'Invalid trail code. Please check and try again.';
      } else if (error.message?.includes('Can only claim once per day')) {
        errorMessage = 'You can only claim once per day. Please try again tomorrow.';
      } else if (error.message?.includes('Can only claim once')) {
        errorMessage = 'You have already claimed this trail reward.';
      }
      
      setErrorMsg(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏞️ Trail NFC Verifier</Text>
        <Text style={styles.subtitle}>Scan or enter your trail code to claim rewards</Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Trail Code:</Text>
        <TextInput
          style={styles.textInput}
          value={nfcInput}
          onChangeText={setNfcInput}
          placeholder="Enter trail code or scan NFC tag"
          placeholderTextColor="#999"
          multiline={false}
        />
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]} 
            onPress={handleNFCScan}
            disabled={isScanning}
          >
            <Text style={styles.scanButtonText}>
              {isScanning ? '📱 Scanning...' : '📱 Scan NFC'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.claimButton, (isPending || !nfcInput.trim()) && styles.claimButtonDisabled]} 
            onPress={claimTrailReward}
            disabled={isPending || !nfcInput.trim()}
          >
            <Text style={styles.claimButtonText}>
              {isPending ? '⏳ Claiming...' : '🎁 Claim Reward'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {errorMsg ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>❌ {errorMsg}</Text>
        </View>
      ) : null}

      {successMsg ? (
        <View style={styles.messageContainer}>
          <Text style={styles.successText}>✅ {successMsg}</Text>
        </View>
      ) : null}

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>• Scan an NFC tag at a trail location</Text>
        <Text style={styles.infoText}>• Or manually enter the trail code</Text>
        <Text style={styles.infoText}>• Claim your trail completion reward</Text>
        <Text style={styles.infoText}>• Rewards may have daily or one-time limits</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  scanButton: {
    flex: 1,
    backgroundColor: '#3182ce',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#a0aec0',
  },
  scanButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  claimButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  claimButtonDisabled: {
    backgroundColor: '#a0aec0',
  },
  claimButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  messageContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 16,
    textAlign: 'center',
  },
  successText: {
    color: '#38a169',
    fontSize: 16,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default TrailNFCVerifier; 