import React, { useEffect, useState } from 'react';
import { useWeb3 } from '@3rdweb/hooks'
import { ConnectWallet } from '@3rdweb/react';
import './App.css';
import { Button } from '@chakra-ui/button';
import { ethers } from 'ethers';

const TrailDAONFTAddress = process.env.REACT_APP_NFT_ADDRESS || '';
const TrailDAONFT = require('./TrailDAONFT.json');

// Create subgraph for trail locations
// Create geolocation request
// Create call to hike method on trail contract

// TODO: What trail locations are close by and display that
// TODO: Look at subgraph

function App() {
  const { address, provider } = useWeb3();
  const [ isMinting, setIsMinting ] = useState(false);
  const [ ownsNFT, setOwnsNFT ] = useState(false);
  const [ mintPrice, setMintPrice ] = useState("0.05");
  
  useEffect(() => {
    const getMintPrice = async () => {
      if (provider) {
        const nftContract = new ethers.Contract(TrailDAONFTAddress, TrailDAONFT.abi, provider.getSigner());
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

  useEffect(() => {
    const checkNFTOwner = async () => {
      if (provider) {
        const nftContract = new ethers.Contract(TrailDAONFTAddress, TrailDAONFT.abi, provider.getSigner());
        const balance = await nftContract.balanceOf(address);
        if (balance > 0) {
          setOwnsNFT(true);
        }
      }
    };
    checkNFTOwner();
  }, [address, provider]);

  const mint = async () => {
    console.log("Minting for address", address)

    if (!provider) {
      throw new Error("No provider");
    }

    setIsMinting(true);

    const nftContract = new ethers.Contract(TrailDAONFTAddress, TrailDAONFT.abi, provider.getSigner());
    const tx = await nftContract.mint({ value: ethers.utils.parseEther("0.05") });
    await tx.wait();
    
    setOwnsNFT(true);
    setIsMinting(false);
  };

  return (
    <div className="App">
      <div className="App-nav">
        <ConnectWallet style={{"marginRight": "10px", "marginTop": "10px"}}/>
      </div>
      <header className="App-header">
        <h1>TrailMix 🥾⛰️</h1>
        { address ? (
          <>
            <p>Mint an NFT to claim $TRAIL</p>
            <p>Mint price {mintPrice} Ξ</p>
            <Button colorScheme='blue' size='lg' disabled={isMinting || ownsNFT} onClick={() => mint()}>
              Mint
            </Button>
          </>
        ) : (
          <p>Connect a wallet to mint an NFT and claim $TRAIL</p>
        ) }
      </header>
    </div>
  );
}

export default App;
