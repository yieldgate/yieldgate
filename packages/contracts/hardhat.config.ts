import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'
import 'hardhat-deploy'
import { HardhatUserConfig } from 'hardhat/types'
dotenv.config()

const accounts = [
  ...(process.env.PRIVATE_KEY_DEPLOYER ? [`${process.env.PRIVATE_KEY_DEPLOYER}`] : []),
]

const config: HardhatUserConfig = {
  solidity: '0.8.10',
  networks: {
    hardhat: {
      //chainId: 1337, // localhost
      chainId: 137, // polygon
      forking: {
        //url: process.env.RPC_80001 || 'https://rpc.ankr.com/polygon_mumbai',
        //blockNumber: 29277750, // 2022-11-22 noon CET
        url: process.env.RPC_137 || 'https://rpc.ankr.com/polygon',
        blockNumber: 35934500, // 2022-11-22 evening CET
      },
    },
    goerli: {
      // 5
      url: process.env.RPC_5 || 'https://rpc.ankr.com/eth_goerli',
      accounts,
    },
    polygon: {
      // 137
      url: process.env.RPC_137 || 'https://rpc.ankr.com/polygon',
    },
    mumbai: {
      // 80001
      url: process.env.RPC_80001 || 'https://rpc.ankr.com/polygon_mumbai',
      accounts,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    offsetter: {
      default: 1,
    },
    whale: {
      default: 2,
    },
  },
  verify: {
    etherscan: {
      apiKey: `${process.env.ETHERSCAN_API_KEY}`,
    },
  },
}

export default config
