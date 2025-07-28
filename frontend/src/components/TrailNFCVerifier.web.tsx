import React from 'react';
import { useTrailNFCVerifier } from '../hooks';
import { TrailNFCVerifierUI } from './TrailNFCVerifierUI';

function TrailNFCVerifier() {
  // Custom NFC scan handler for Web
  const customNFCScanHandler = async () => {
    // This will be called by the hook's handleNFCScan function
    // We need to access the hook's state setters, so we'll implement this differently
  };

  const {
    nfcInput,
    setNfcInput,
    isScanning,
    setIsScanning,
    isPending,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    handleNFCScan,
    claimTrailReward,
  } = useTrailNFCVerifier();

  // Override the default NFC scan behavior for web
  const handleWebNFCScan = async () => {
    setIsScanning(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Check if Web NFC is supported
      if ('NDEFReader' in window) {
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();
        
        ndef.addEventListener('reading', ({ message, serialNumber }: any) => {
          console.log(`NFC tag read with serial number: ${serialNumber}`);
          
          for (const record of message.records) {
            if (record.recordType === 'text') {
              const textDecoder = new TextDecoder(record.encoding);
              const nfcData = textDecoder.decode(record.data);
              setNfcInput(nfcData);
              setSuccessMsg('NFC tag scanned successfully!');
              setIsScanning(false);
              break;
            }
          }
        });
        
        ndef.addEventListener('readingerror', () => {
          setErrorMsg('Error reading NFC tag. Please try again.');
          setIsScanning(false);
        });
        
        // Auto-stop scanning after 30 seconds
        setTimeout(() => {
          if (isScanning) {
            setIsScanning(false);
            setErrorMsg('NFC scan timeout. Please try again.');
          }
        }, 30000);
        
      } else {
        setErrorMsg('NFC is not supported on this device/browser. Please enter the trail code manually.');
        setIsScanning(false);
      }
    } catch (error: any) {
      console.error('NFC scan error:', error);
      let errorMessage = 'NFC scanning failed. Please enter the trail code manually.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'NFC permission denied. Please allow NFC access and try again.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'NFC is not supported on this device/browser.';
      }
      
      setErrorMsg(errorMessage);
      setIsScanning(false);
    }
  };

  return (
    <TrailNFCVerifierUI
      nfcInput={nfcInput}
      setNfcInput={setNfcInput}
      isScanning={isScanning}
      isPending={isPending}
      errorMsg={errorMsg}
      successMsg={successMsg}
      onNFCScan={handleWebNFCScan}
      onClaimReward={claimTrailReward}
    />
  );
}

export default TrailNFCVerifier;