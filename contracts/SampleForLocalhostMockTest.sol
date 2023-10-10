//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "redstone-evm-connector/lib/contracts/message-based/PriceAware.sol";

contract SampleForLocalhostMockTest is PriceAware {

function isSignerAuthorized(address) public override virtual view returns (bool) {
    return true;
  }

function extractOracleValuesView(bytes32 dataFeedId)
    external
    view
    returns (uint256)
  {
    return getPriceFromMsg(dataFeedId);
  }
}