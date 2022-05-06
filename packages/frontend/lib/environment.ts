export const env = {
  isProduction: process.env.NEXT_PUBLIC_PRODUCTION_MODE === 'true',
  url: process.env.NEXT_PUBLIC_URL,

  defaultChain: process.env.NEXT_PUBLIC_DEFAULT_CHAIN!,
  supportedChains: JSON.parse(process.env.NEXT_PUBLIC_SUPPORTED_CHAINS!),

  infuraApiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY!,

  rpc: {
    hardhat: process.env.NEXT_PUBLIC_RPC_HARDHAT!,
    polygonMumbai: process.env.NEXT_PUBLIC_RPC_POLYGON_MUMBAI!,
    rinkeby: process.env.NEXT_PUBLIC_RPC_RINKEBY!,
    polygon: process.env.NEXT_PUBLIC_RPC_POLYGON!,
    mainnet: process.env.NEXT_PUBLIC_RPC_MAINNET!,
  },

  mongo: {
    uri: process.env.MONGODB_URI!,
    db: process.env.MONGODB_DB!,
  },
}
