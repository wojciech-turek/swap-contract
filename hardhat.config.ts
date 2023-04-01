import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  etherscan: {
    apiKey: "ZSNZJ6U7T1S6EMZ7QP87F39TCD4QQD2CPX",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    polygon: {
      url: "https://polygon-rpc.com/",
      chainId: 137,
      accounts: ["PRIVATE_KEY"],
      verify: {
        etherscan: {
          apiKey: "POLYGONSCAN_API_KEY",
          apiUrl: "https://api.polygonscan.com/",
        },
      },
      gasMultiplier: 2,
    },
  },
};

export default config;
