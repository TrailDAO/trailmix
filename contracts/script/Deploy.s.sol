// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {TrailMixNFT} from "../src/TrailMixNFT.sol";
import {TrailToken} from "../src/TrailToken.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console2.log("Deploying from:", deployer);
        console2.log("Chain ID:", block.chainid);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TrailToken first
        TrailToken trailToken = new TrailToken();
        console2.log("TrailToken deployed at:", address(trailToken));

        // Deploy TrailMixNFT
        TrailMixNFT trailNFT = new TrailMixNFT(
            address(trailToken),
            vm.envUint("INITIAL_MINT_PRICE")
        );
        console2.log("TrailMixNFT deployed at:", address(trailNFT));

        // Set NFT as minter for tokens
        trailToken.addMinter(address(trailNFT));

        vm.stopBroadcast();
        
        console2.log("Deployment complete!");
    }
}
