import { ApolloProvider } from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'
// import { Provider as WagmiProvider } from 'wagmi'
import {
  ChainId,
  Config,
  DAppProvider,
  MULTICALL_ADDRESSES
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
import { ContractAddresses } from '../artifacts/addresses'
import { useApollo } from '../lib/apolloClient'
import { env } from '../lib/environment'

// scaffold-eth's INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'

const dappConfig: Config = {
  readOnlyUrls: {
    [ChainId.Localhost]: 'http://127.0.0.1:8545',
    [ChainId.Mumbai]: env.rpc.polygonMumbai,
    [ChainId.Polygon]: env.rpc.polygonMainnet,
  },
  supportedChains: [
    ChainId.Localhost,
    ChainId.Mumbai,
    ChainId.Polygon,
  ],
  multicallAddresses: {
    ...MULTICALL_ADDRESSES,
    [ChainId.Localhost]: ContractAddresses[ChainId.Localhost].MulticallContract,
    [ChainId.Mumbai]: ContractAddresses[ChainId.Localhost].MulticallContract,
    [ChainId.Polygon]: ContractAddresses[ChainId.Localhost].MulticallContract,
  },
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApollo(pageProps)
  return (
    <ApolloProvider client={apolloClient}>
      <DAppProvider config={dappConfig}>
        {/* <WagmiProvider> */}
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
        {/* </WagmiProvider> */}
      </DAppProvider>
    </ApolloProvider>
  )
}

export default MyApp
