#!/bin/bash

# Copy ABI to frontend
jq '.abi' ./contracts/out/TrailMixNFT.sol/TrailMixNFT.json > ./frontend/src/contracts/TrailMixNFT.json

jq '.abi' ./contracts/out/TrailToken.sol/TrailToken.json > ./frontend/src/contracts/TrailToken.json

jq '.abi' ./contracts/out/TrailProofReward.sol/TrailProofReward.json > ./frontend/src/contracts/TrailProofReward.json
