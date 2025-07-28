import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

interface TrailNFCVerifierUIProps {
  nfcInput: string;
  setNfcInput: (value: string) => void;
  isScanning: boolean;
  isPending: boolean;
  errorMsg: string;
  successMsg: string;
  onNFCScan: () => void;
  onClaimReward: () => void;
}

export function TrailNFCVerifierUI({
  nfcInput,
  setNfcInput,
  isScanning,
  isPending,
  errorMsg,
  successMsg,
  onNFCScan,
  onClaimReward,
}: TrailNFCVerifierUIProps) {
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
            onPress={onNFCScan}
            disabled={isScanning}
          >
            <Text style={styles.scanButtonText}>
              {isScanning ? '📱 Scanning...' : '📱 Scan NFC'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.claimButton, (isPending || !nfcInput.trim()) && styles.claimButtonDisabled]} 
            onPress={onClaimReward}
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
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  inputSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  scanButton: {
    flex: 1,
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  claimButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  claimButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  claimButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messageContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
  successText: {
    color: '#27ae60',
    fontSize: 16,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 6,
    lineHeight: 20,
  },
});
