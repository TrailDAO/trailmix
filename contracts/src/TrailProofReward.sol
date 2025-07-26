// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TrailProofReward is Ownable {
    bytes32 public trailHash = keccak256(abi.encodePacked("TRAILXYZ-20250726")); // Example NFC hash; update as needed
    
    enum ClaimScheme { UNLIMITED, ONCE_PER_DAY, ONLY_ONCE }
    ClaimScheme public currentScheme;
    
    uint256 public constant CLAIM_COOLDOWN = 1 days; // 86,400 seconds (24 hours)
    
    mapping(address => uint256) public lastClaimTime; // Tracks last claim timestamp for ONCE_PER_DAY
    mapping(address => bool) public hasClaimed; // Tracks if claimed for ONLY_ONCE
    
    event RewardMinted(address indexed user, uint256 timestamp);
    event SchemeChanged(ClaimScheme newScheme);

    constructor(address initialOwner) Ownable(initialOwner) {
        currentScheme = ClaimScheme.ONCE_PER_DAY; // Default to daily claims
    }

    function claim(bytes32 _nfcData) external {
        require(_nfcData == trailHash, "Invalid NFC data");
        
        if (currentScheme == ClaimScheme.ONCE_PER_DAY) {
            uint256 userLastClaim = lastClaimTime[msg.sender];
            require(block.timestamp >= userLastClaim + CLAIM_COOLDOWN, "Can only claim once per day");
            lastClaimTime[msg.sender] = block.timestamp;
        } else if (currentScheme == ClaimScheme.ONLY_ONCE) {
            require(!hasClaimed[msg.sender], "Can only claim once");
            hasClaimed[msg.sender] = true;
        } // UNLIMITED scheme has no restrictions
        
        // Mint TRAIL token or NFT logic here (e.g., integrate ERC20/ERC721)
        // Example: trailToken.mint(msg.sender, rewardAmount);
        
        emit RewardMinted(msg.sender, block.timestamp);
    }
    
    function setScheme(ClaimScheme _scheme) external onlyOwner {
        currentScheme = _scheme;
        emit SchemeChanged(_scheme);
    }
}