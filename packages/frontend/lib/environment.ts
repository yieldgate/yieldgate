export const env = {
  isProduction: process.env.NEXT_PUBLIC_PRODUCTION_MODE === 'true',
  url: process.env.NEXT_PUBLIC_URL,

  supportedChains: JSON.parse(process.env.NEXT_PUBLIC_SUPPORTED_CHAINS),

  infuraApiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,

  alchemyApiKeys: {
    mumbai: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI,
  },

  rpc: {
    hardhat: process.env.NEXT_PUBLIC_RPC_HARDHAT,
    polygonMainnet: process.env.NEXT_PUBLIC_RPC_POLYGON_MUMBAI,
    polygonMumbai: process.env.NEXT_PUBLIC_RPC_POLYGON,
  },
}
