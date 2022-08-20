import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { allChains, chain, Chain, configureChains, createClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { env } from './environment'

/**
 * Wagmi.sh Configuration (https://wagmi.sh/docs)
 */

export const defaultChain: Chain | undefined = allChains.find(
  (chain) => env.defaultChain === chain.id
)

export const isChainSupported = (chainId?: number): boolean => {
  return chainId && env.supportedChains.includes(chainId)
}
export const supportedChains: Chain[] = allChains.filter((chain) => isChainSupported(chain.id))

export const {
  chains: [, ...chains],
  provider,
} = configureChains(
  Array.from(new Set([chain.mainnet, defaultChain, ...supportedChains])).filter(Boolean) as Chain[],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        const rpcUrl = env.rpcUrls[chain.id as keyof typeof env.rpcUrls]
        if (!rpcUrl) {
          throw new Error(`No RPC provided for chain ${chain.id}`)
        }
        return { http: rpcUrl }
      },
    }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'YieldGate',
  chains,
})

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})
