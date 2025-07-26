// Contract addresses with validation
const getRequiredAddress = (envVar: string | undefined, contractName: string): string => {
  if (!envVar || envVar.trim() === '') {
    throw new Error(`Missing required environment variable for ${contractName}. Please check your .env configuration.`);
  }
  return envVar;
};

export const TrailMixNFTAddress = getRequiredAddress(process.env.EXPO_PUBLIC_NFT_ADDRESS, 'TrailMixNFT');
export const TrailMixNFT = require('./TrailMixNFT.json');

export const TrailTokenAddress = getRequiredAddress(process.env.EXPO_PUBLIC_TOKEN_ADDRESS, 'TrailToken');
export const TrailToken = require('./TrailToken.json');

export const TrailProofRewardAddress = getRequiredAddress(process.env.EXPO_PUBLIC_PROOF_ADDRESS, 'TrailProofReward');
export const TrailProofReward = require('./TrailProofReward.json');
