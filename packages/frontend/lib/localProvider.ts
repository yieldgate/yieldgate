import { ChainId } from '@usedapp/core'
import { providers } from 'ethers'
import { env } from './environment'

export const getLocalProvider = (chainId) => {
  return new providers.StaticJsonRpcProvider(
    {
      [ChainId.Localhost]: env.rpc.hardhat,
      [ChainId.Mumbai]: env.rpc.polygonMumbai,
      [ChainId.Polygon]: env.rpc.polygonMainnet,
    }[chainId]!
  )
}
