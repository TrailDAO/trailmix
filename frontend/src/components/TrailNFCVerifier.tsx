import React from 'react';
import { Alert } from 'react-native';
import { useTrailNFCVerifier } from '../hooks';
import { TrailNFCVerifierUI } from './TrailNFCVerifierUI';

function TrailNFCVerifier() {
  // Custom NFC scan handler for React Native
  const customNFCScanHandler = async () => {
    // For React Native, you would typically use a library like react-native-nfc-manager
    // This is a placeholder implementation
    Alert.alert(
      "NFC Scan",
      "NFC scanning would be implemented with react-native-nfc-manager. For now, please enter the trail code manually."
    );
  };

  const {
    nfcInput,
    setNfcInput,
    isScanning,
    isPending,
    errorMsg,
    successMsg,
    handleNFCScan,
    claimTrailReward,
  } = useTrailNFCVerifier(customNFCScanHandler);

  return (
    <TrailNFCVerifierUI
      nfcInput={nfcInput}
      setNfcInput={setNfcInput}
      isScanning={isScanning}
      isPending={isPending}
      errorMsg={errorMsg}
      successMsg={successMsg}
      onNFCScan={handleNFCScan}
      onClaimReward={claimTrailReward}
    />
  );
}

export default TrailNFCVerifier;