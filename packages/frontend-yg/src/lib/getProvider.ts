import { getDefaultProvider } from 'ethers'
import { getRpcUrl } from './wagmiClient'

/**
 * Returns the ethers `BaseProvider` with our rpc for the given `chainId`.
 */
export const getProvider = (chainId: number) => {
  return getDefaultProvider(getRpcUrl(chainId))
}
