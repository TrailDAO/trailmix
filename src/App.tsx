import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { useWeb3 } from '@3rdweb/hooks'
import { ConnectWallet } from '@3rdweb/react';

import Mint from './Mint';

import Geolocation from './Geolocation';
import TrailBalance from './TrailBalance';
import Instructions from './Instructions';

import { TrailMixNFTAddress, TrailMixNFT } from './Addresses';
import './App.css';

function App() {
  const { address, provider } = useWeb3();
  const [ ownsNFT, setOwnsNFT ] = useState(false);

  useEffect(() => {
    const checkNFTOwner = async () => {
      if (provider) {
        const nftContract = new ethers.Contract(TrailMixNFTAddress, TrailMixNFT.abi, provider.getSigner());
        const balance = await nftContract.balanceOf(address);
        if (balance > 0) {
          setOwnsNFT(true);
        }
      }
    };
    checkNFTOwner();
  }, [address, provider]);

  return (
    <div className="App">
      <div className="App-nav">
        <TrailBalance />
        <ConnectWallet className="App-nav-item"/>
      </div>
      <header className="App-header">
        <h1>TrailMix 🥾⛰️</h1>
        { ownsNFT ? <Geolocation /> : address ? 
          <Mint afterMint={() => setOwnsNFT(true)}/> : 
          <Instructions /> }
      </header>
    </div>
  );
}

export default App;
