import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
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
    swapper: 1,
  },
  networks: {
    hardhat: {
      loggingEnabled: true,
      forking: {
        enabled: true,
        url: "https://polygon-mainnet.infura.io/v3/API_KEY",
        blockNumber: 41054105,
      },
      mining: {
        auto: false,
        interval: 1000,
      },
    },
    polygon: {
      url: "https://polygon-rpc.com/",
      chainId: 137,
      accounts: [],
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
