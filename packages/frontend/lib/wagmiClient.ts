import { allChains, Chain, chain, configureChains, createClient } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { env } from './environment'

/**
 * Wagmi.sh Configuration (https://wagmi.sh/docs)
 */

export const rpcsByChainId: {
  [chainId: number]: string
} = {
  [1337]: env.rpc.hardhat,
  [chain.polygonMumbai.id]: env.rpc.polygonMumbai,
  [chain.rinkeby.id]: env.rpc.rinkeby,
  [chain.mainnet.id]: env.rpc.mainnet,
  [chain.polygon.id]: env.rpc.polygon,
}

export const defaultChain: Chain = allChains.filter((chain) => env.defaultChain === chain.id)[0]
export const supportedChains: Chain[] = allChains.filter((chain) =>
  env.supportedChains.includes(chain.id)
)

const { provider } = configureChains(
  Array.from(new Set([defaultChain, chain.mainnet, ...supportedChains])),
  [
    jsonRpcProvider({
      rpc: (chain) => {
        const rpcUrl = rpcsByChainId?.[chain.id]
        return rpcUrl ? { http: rpcUrl } : null
      },
    }),
    publicProvider(),
  ]
)

export const connectors = [
  new InjectedConnector({
    chains: supportedChains,
  }),
  new WalletConnectConnector({
    options: {
      qrcode: true,
    },
  }),
  new CoinbaseWalletConnector({
    options: {
      appName: 'Yieldgate.xyz',
    },
  }),
]

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})
