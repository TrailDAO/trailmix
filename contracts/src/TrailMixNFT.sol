// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/ITrailToken.sol";

contract TrailMixNFT is ERC721, ERC721Enumerable, Ownable, Pausable, ReentrancyGuard {
    uint256 public mintPrice;
    uint256 private _tokenIdCounter;
    ITrailToken public trailToken;
    
    mapping(uint256 => string) private _tokenURIs;
    
    event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 price);
    event MintPriceUpdated(uint256 newPrice);
    event TrailTokenUpdated(address newTrailToken);
    
    constructor(
        address _trailToken,
        uint256 _mintPrice
    ) ERC721("TrailMix Membership", "TRAIL") Ownable(msg.sender) {
        trailToken = ITrailToken(_trailToken);
        mintPrice = _mintPrice;
    }
    
    function mint() external payable nonReentrant whenNotPaused {
        require(msg.value >= mintPrice, "Insufficient payment");
        
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        
        // Mint trail tokens as reward
        trailToken.mint(msg.sender, 100 * 10**18); // 100 TRAIL tokens
        
        // Refund excess payment
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }
        
        emit NFTMinted(msg.sender, tokenId, mintPrice);
    }
    
    function setMintPrice(uint256 _newPrice) external onlyOwner {
        mintPrice = _newPrice;
        emit MintPriceUpdated(_newPrice);
    }
    
    function setTrailToken(address _newTrailToken) external onlyOwner {
        trailToken = ITrailToken(_newTrailToken);
        emit TrailTokenUpdated(_newTrailToken);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    // Required overrides
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}


