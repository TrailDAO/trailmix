import React, { useState } from 'react';
import { useWeb3 } from "@3rdweb/hooks"
import { ConnectWallet } from "@3rdweb/react";
import './App.css';

// Create mint nft button
// Create subgraph for trail locations
// Create geolocation request
// Create call to hike method on trail contract

function App() {
  const { address, provider } = useWeb3();

  // does this address have an NFT, if not, mint button

  return (
    <div className="App">
      <header className="App-header">
        <h1>TrailMix 🥾⛰️</h1>
        <p>Connect a wallet to mint an NFT and claim $TRAIL</p>
        <ConnectWallet/>
      </header>
    </div>
  );
}

export default App;
