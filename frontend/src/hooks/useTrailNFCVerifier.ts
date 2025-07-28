import { useState } from 'react';
import { Alert } from 'react-native';
import { useWriteContract, useAccount } from 'wagmi';
import { keccak256, stringToBytes } from 'viem';
import { TrailProofRewardAddress, TrailProofReward } from '../config';

export interface NFCScanHandler {
  (): Promise<void>;
}

export interface UseTrailNFCVerifierReturn {
  // State
  address: string | undefined;
  nfcInput: string;
  isScanning: boolean;
  isPending: boolean;
  errorMsg: string;
  successMsg: string;
  
  // Actions
  setNfcInput: (value: string) => void;
  setIsScanning: (value: boolean) => void;
  setErrorMsg: (value: string) => void;
  setSuccessMsg: (value: string) => void;
  claimTrailReward: () => Promise<void>;
  handleNFCScan: NFCScanHandler;
  clearMessages: () => void;
  
  // Utilities
  stringToBytes32: (str: string) => string;
}

export const useTrailNFCVerifier = (customNFCScanHandler?: NFCScanHandler): UseTrailNFCVerifierReturn => {
  const { address } = useAccount();
  const { writeContract: claimReward, isPending } = useWriteContract();
  
  // State management
  const [nfcInput, setNfcInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Utility function to convert string to bytes32 hash
  const stringToBytes32 = (str: string): string => {
    return keccak256(stringToBytes(str));
  };

  // Clear error and success messages
  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Default NFC scan handler (can be overridden)
  const defaultNFCScanHandler: NFCScanHandler = async () => {
    setIsScanning(true);
    clearMessages();

    try {
      // Default implementation shows alert for manual entry
      Alert.alert(
        "NFC Scan",
        "NFC scanning is not implemented for this platform. Please enter the trail code manually.",
        [{ text: "OK", onPress: () => setIsScanning(false) }]
      );
    } catch (error) {
      console.error('NFC scan error:', error);
      setErrorMsg('NFC scanning failed. Please enter the trail code manually.');
      setIsScanning(false);
    }
  };

  // Use custom handler if provided, otherwise use default
  const handleNFCScan = customNFCScanHandler || defaultNFCScanHandler;

  // Trail reward claiming logic
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
      clearMessages();
      
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

  return {
    // State
    address,
    nfcInput,
    isScanning,
    isPending,
    errorMsg,
    successMsg,
    
    // Actions
    setNfcInput,
    setIsScanning,
    setErrorMsg,
    setSuccessMsg,
    claimTrailReward,
    handleNFCScan,
    clearMessages,
    
    // Utilities
    stringToBytes32,
  };
};
