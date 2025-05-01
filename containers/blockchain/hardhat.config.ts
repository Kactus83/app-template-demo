import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "dotenv/config";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  typechain: {
    outDir: "types", 
    target: "ethers-v6", 
  },
  networks: {
    localhost: {
      url: "http://0.0.0.0:8545",
    },
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};

export default config;
