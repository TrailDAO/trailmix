import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { useWeb3 } from '@3rdweb/hooks'
import { Button } from '@chakra-ui/button';

import { TrailMixNFTAddress, TrailMixNFT } from './Addresses';

interface MintProps {
  afterMint: () => void;
}

function Mint({ afterMint }: MintProps) {
  const { address, provider } = useWeb3();
  const [ mintPrice, setMintPrice ] = useState("0.05");
  const [ isMinting, setIsMinting ] = useState(false);

  useEffect(() => {
    const getMintPrice = async () => {
      if (provider) {
        const nftContract = new ethers.Contract(TrailMixNFTAddress, TrailMixNFT.abi, provider.getSigner());
        const mintPrice = await nftContract.mintPrice();
        if (mintPrice) {
          setMintPrice(
            ethers.utils.formatEther(mintPrice)
          );
        }
      }
    };
    getMintPrice();
  }, [provider]);

  const mint = async () => {
    console.log("Minting for address", address)
  
    if (!provider) {
      throw new Error("No provider");
    }
  
    setIsMinting(true);
  
    const nftContract = new ethers.Contract(TrailMixNFTAddress, TrailMixNFT.abi, provider.getSigner());
    const tx = await nftContract.mint({ value: ethers.utils.parseEther(mintPrice) });
    await tx.wait();
    
    afterMint();
    setIsMinting(false);
  };

  return (
    <>
      <p>Mint an NFT to claim 🏕️ TRAIL</p>
      <p>Mint price {mintPrice} Ξ</p>
      <Button colorScheme='green' size='lg' disabled={isMinting} onClick={() => mint()}>
        Mint
      </Button>
    </>
  );
};

export default Mint;