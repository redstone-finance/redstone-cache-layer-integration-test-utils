import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/config";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
  },
  mocha: {
    timeout: 300_000, // 300 seconds
  },
  networks: {
    hardhat: {
      blockGasLimit: 30_000_000,
    },
  },
};

export default config;
