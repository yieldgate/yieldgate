import { InjectedConnector } from '@wagmi/core'
import { ethers, providers } from 'ethers'
import { chain, Connector, createClient } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { env } from './environment'

/**
 * Wagmi.sh Configuration (https://wagmi.sh/docs)
 */

export interface IRPCMap {
  [chainId: number]: string
}
export const rpcsByChainId: IRPCMap = {
  [chain.hardhat.id]: env.rpc.hardhat,
  [chain.polygonMumbai.id]: env.rpc.polygonMumbai,
  [chain.rinkeby.id]: env.rpc.rinkeby,
  [chain.mainnet.id]: env.rpc.mainnet,
  [chain.polygon.id]: env.rpc.polygon,
}

export const connectors = ({ chainId }: { chainId?: number }): Connector[] => {
  return [
    new InjectedConnector(),
    new WalletConnectConnector({
      options: {
        chainId,
        rpc: rpcsByChainId,
        qrcode: true,
      },
    }),
    new CoinbaseWalletConnector({
      options: {
        appName: 'Yieldgate.xyz',
        jsonRpcUrl: rpcsByChainId?.[chainId || chain.hardhat.id],
      },
    }),
  ]
}

export const provider = ({ chainId }: { chainId?: number }) => {
  if (!chainId) return ethers.getDefaultProvider()
  const rpc = rpcsByChainId?.[chainId]
  return rpc
    ? new providers.JsonRpcProvider(rpc, chainId)
    : new providers.InfuraProvider(chainId, env.infuraApiKey)
}

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider: provider,
})
