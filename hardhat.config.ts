import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337, // Local Hardhat chain ID
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
        url: process.env.ALCHEMY_API_URL,
        accounts: [`0x${process.env.SEPOLIA_PRIVATE_KEY}`],
    }
  }
};

export default config;
