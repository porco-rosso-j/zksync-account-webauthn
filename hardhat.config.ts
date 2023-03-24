import { HardhatUserConfig } from 'hardhat/config';
import "@nomiclabs/hardhat-ethers";
import "@matterlabs/hardhat-zksync-chai-matchers";
import "@matterlabs/hardhat-zksync-toolbox";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const zkSyncTestnet =
  process.env.NODE_ENV == "test"
    ? {
        url: "http://localhost:3050",
        ethNetwork: "http://localhost:8545",
        zksync: true,
      }
    : {
        url: "https://zksync2-testnet.zksync.dev",
        ethNetwork: process.env.alchemy_api_goerli,
        zksync: true,
      };

      const compilers = [
        {version: "0.8.0"}, {version: "0.8.1"}, {version: "0.8.11"},
        
     ]

const config:HardhatUserConfig = {
  zksolc: {
    version: '1.3.5',
    compilerSource: 'binary',
    settings: {
      isSystem: true
    },
  },

  defaultNetwork: "zkSyncTestnet",

  networks: {
    hardhat: {
        // @ts-ignore
        zksync: true
    },
    zkSyncTestnet,
  },
  solidity: {
    compilers: compilers,
  },
};

export default config;