import React, { useEffect, useState } from 'react';
import { TrailTokenAddress, TrailToken } from './Addresses';

import { ethers } from 'ethers';
import { useWeb3 } from '@3rdweb/hooks'

function TrailBalance() {
  const [ trailBalance, setTrailBalance ] = useState("0.0");

  const { address, provider } = useWeb3();

  useEffect(() => {
    const getTrailBalance = async () => {
      if (provider) {
        const token = new ethers.Contract(TrailTokenAddress, TrailToken.abi, provider.getSigner());
        const balance = await token.balanceOf(address);
        if (balance) {
          setTrailBalance(
            ethers.utils.formatEther(balance)
          );
        }
      }
    };
    getTrailBalance();
  }, [address, provider]);

  
  return (
    <div className="App-nav-item">
      { address ? "🏕️ TRAIL " + trailBalance : "" }
    </div>
  );
};

export default TrailBalance;