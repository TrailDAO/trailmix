// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ITrailToken {
    function mint(address to, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}
