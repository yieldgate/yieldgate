export const env = {
  isProduction: process.env.NEXT_PUBLIC_PRODUCTION_MODE === 'true',
  url: process.env.NEXT_PUBLIC_URL,

  rpc: {
    hardhat: process.env.RPC_HARDHAT,
    polygonMainnet: process.env.RPC_POLYGON_MUMBAI,
    polygonMumbai: process.env.RPC_POLYGON,
  },
}
