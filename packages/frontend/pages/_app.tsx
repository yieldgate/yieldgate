import { ApolloProvider } from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'
// import { Provider as WagmiProvider } from 'wagmi'
import {
  ChainId
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
import { defaultChains, InjectedConnector, Provider as WagmiProvider } from 'wagmi'
import { useApollo } from '../lib/apolloClient'
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

const chains = defaultChains
const connectors = ({ chainId }) => {
  const rpcUrl = {
    [ChainId.Localhost]: env.rpc.hardhat,
    [ChainId.Mumbai]: env.rpc.polygonMumbai,
    [ChainId.Polygon]: env.rpc.polygonMainnet,
  }[chainId]
  return [
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
  ]
}


const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApollo(pageProps)
  return (
    <ApolloProvider client={apolloClient}>
      {/* <DAppProvider config={dappConfig}> */}
      <WagmiProvider autoConnect connectors={connectors}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </WagmiProvider>
      {/* </DAppProvider> */}
    </ApolloProvider>
  )
}

export default MyApp
