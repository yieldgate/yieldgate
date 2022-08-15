import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'
import 'hardhat-deploy'
import { HardhatUserConfig } from 'hardhat/types'
import path from 'path'
dotenv.config()

const accounts = [
  ...(process.env.PRIVATE_KEY_DEPLOYER ? [`${process.env.PRIVATE_KEY_DEPLOYER}`] : []),
]

const config: HardhatUserConfig = {
  solidity: '0.8.10',
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: false,
      blockGasLimit: 20000000, // 20 million
      // chainId: 80001,
      // forking: {
      //   url: process.env.RPC_80001 || 'https://rpc.ankr.com/polygon_mumbai',
      // },
    },
    rinkeby: {
      chainId: 4,
      url: process.env.RPC_4 || 'https://rpc.ankr.com/eth_rinkeby',
      accounts,
    },
    goerli: {
      chainId: 5,
      url: process.env.RPC_5 || 'https://rpc.ankr.com/eth_goerli',
      accounts,
    },
    mumbai: {
      chainId: 80001,
      url: process.env.RPC_80001 || 'https://rpc.ankr.com/polygon_mumbai',
      accounts,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  typechain: {
    outDir: path.resolve('../frontend/src/types/typechain'),
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
}

export default config
