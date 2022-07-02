/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const env = {
  url:
    process.env.NEXT_PUBLIC_VERCEL_URL && process.env.NEXT_PUBLIC_VERCEL_ENV! === 'preview'
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_URL,
  isProduction: process.env.NEXT_PUBLIC_PRODUCTION_MODE === 'true',

  defaultChain: process.env.NEXT_PUBLIC_DEFAULT_CHAIN!,
  supportedChains: JSON.parse(process.env.NEXT_PUBLIC_SUPPORTED_CHAINS!),

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
