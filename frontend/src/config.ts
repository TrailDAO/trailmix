// TrailMix Configuration
// Centralized configuration with validation for all environment variables

interface AppConfig {
  // Wallet Connect / AppKit
  projectId: string;
  
  // Contract Addresses
  contracts: {
    trailMixNFT: {
      address: string;
      abi: any;
    };
    trailToken: {
      address: string;
      abi: any;
    };
    trailProofReward: {
      address: string;
      abi: any;
    };
  };
}

// Validation helper function
const getRequiredEnvVar = (envVar: string | undefined, varName: string): string => {
  if (!envVar || envVar.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${varName}. ` +
      `Please check your .env file and ensure ${varName} is set.`
    );
  }
  return envVar.trim();
};

// Load and validate all configuration
const loadConfig = (): AppConfig => {
  try {
    // Validate all required environment variables
    const projectId = getRequiredEnvVar(
      process.env.EXPO_PUBLIC_REOWN_PROJECT_ID, 
      'EXPO_PUBLIC_REOWN_PROJECT_ID'
    );
    
    const trailMixNFTAddress = getRequiredEnvVar(
      process.env.EXPO_PUBLIC_NFT_ADDRESS, 
      'EXPO_PUBLIC_NFT_ADDRESS'
    );
    
    const trailTokenAddress = getRequiredEnvVar(
      process.env.EXPO_PUBLIC_TOKEN_ADDRESS, 
      'EXPO_PUBLIC_TOKEN_ADDRESS'
    );
    
    const trailProofRewardAddress = getRequiredEnvVar(
      process.env.EXPO_PUBLIC_PROOF_ADDRESS, 
      'EXPO_PUBLIC_PROOF_ADDRESS'
    );

    // Load contract ABIs
    let trailMixNFTAbi, trailTokenAbi, trailProofRewardAbi;
    
    try {
      trailMixNFTAbi = require('./contracts/TrailMixNFT.json');
      trailTokenAbi = require('./contracts/TrailToken.json');
      trailProofRewardAbi = require('./contracts/TrailProofReward.json');
    } catch (error) {
      throw new Error(
        'Failed to load contract ABIs. Please ensure contract JSON files exist in src/contracts/'
      );
    }

    return {
      projectId,
      contracts: {
        trailMixNFT: {
          address: trailMixNFTAddress,
          abi: trailMixNFTAbi.abi,
        },
        trailToken: {
          address: trailTokenAddress,
          abi: trailTokenAbi.abi,
        },
        trailProofReward: {
          address: trailProofRewardAddress,
          abi: trailProofRewardAbi.abi,
        },
      },
    };
  } catch (error) {
    console.error('❌ Configuration Error:', error);
    throw error;
  }
};

// Export the validated configuration
export const config = loadConfig();

// Export individual items for convenience
export const {
  projectId,
  contracts: {
    trailMixNFT: { address: TrailMixNFTAddress, abi: TrailMixNFTAbi },
    trailToken: { address: TrailTokenAddress, abi: TrailTokenAbi },
    trailProofReward: { address: TrailProofRewardAddress, abi: TrailProofRewardAbi },
  },
} = config;

// Legacy exports for backward compatibility (can be removed later)
export const TrailMixNFT = { abi: TrailMixNFTAbi };
export const TrailToken = { abi: TrailTokenAbi };
export const TrailProofReward = { abi: TrailProofRewardAbi };
