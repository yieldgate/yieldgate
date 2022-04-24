import { ChakraProvider } from '@chakra-ui/react'
import { ChainId } from '@usedapp/core'
import { providers } from 'ethers'
import type { AppProps } from 'next/app'
import * as React from 'react'
import {
  defaultChains,
  InjectedConnector,
  Provider as WagmiProvider
} from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { env } from '../lib/environment'


// scaffold-eth's INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'

// const dappConfig: Config = {
//   readOnlyUrls: {
//     [ChainId.Localhost]: env.rpc.hardhat,
//     [ChainId.Mumbai]: env.rpc.polygonMumbai,
//     [ChainId.Polygon]: env.rpc.polygonMainnet,
//   },
//   supportedChains: env.supportedChains,
//   multicallAddresses: {
//     ...MULTICALL_ADDRESSES,
//     [ChainId.Localhost]: ContractAddresses[ChainId.Localhost].MulticallContract,
//   },
// }

const chains = defaultChains.filter((chain) =>
  (env.supportedChains || []).includes(chain.id)
)
const connectors = ({ chainId }) => {
  return [
    new InjectedConnector({
      chains: defaultChains,
      options: {
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      options: {
        chainId: 80001,
        rpc: {
          80001: env.rpc.polygonMumbai,
        },
        qrcode: true,
      },
    }),
    new CoinbaseWalletConnector({
      options: {
        appName: 'Yieldgate.xyz',
        jsonRpcUrl: env.rpc.polygonMumbai,
      },
    }),
  ]
}

const provider = ({ chainId }) => {
  if (chainId === ChainId.Localhost || chainId === 31337)
    return new providers.JsonRpcProvider(env.rpc.hardhat)
  // if (chainId === ChainId.Mumbai) return new providers.JsonRpcProvider(env.rpc.hardhat)
  // if (chainId === ChainId.Mainnet) return new providers.JsonRpcProvider(env.rpc.hardhat)
  // if (chainId === ChainId.Mumbai) return new providers.JsonRpcProvider(env.rpc.polygonMumbai)
  if (chainId === ChainId.Mumbai)
    return new providers.AlchemyProvider(chainId, env.alchemyApiKeys.mumbai)
  return new providers.InfuraProvider(chainId, env.infuraApiKey)
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <WagmiProvider autoConnect connectors={connectors} provider={provider}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </WagmiProvider>
  )
}

export default MyApp
