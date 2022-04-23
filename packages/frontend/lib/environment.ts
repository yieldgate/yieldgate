export const env = {
  isProduction: process.env.NEXT_PUBLIC_PRODUCTION_MODE === 'true',
  url: process.env.NEXT_PUBLIC_URL,

  rpc: {
    hardhat: process.env.NEXT_PUBLIC_RPC_HARDHAT,
    polygonMainnet: process.env.NEXT_PUBLIC_RPC_POLYGON_MUMBAI,
    polygonMumbai: process.env.NEXT_PUBLIC_RPC_POLYGON,
  },
}
