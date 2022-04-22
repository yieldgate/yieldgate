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
import { MulticallContract } from '../artifacts/contracts/contractAddress'
import { useApollo } from '../lib/apolloClient'

// scaffold-eth's INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'

const config: Config = {
  readOnlyUrls: {
    [ChainId.Localhost]: 'http://localhost:8545',
    [ChainId.Mumbai]: `https://ropsten.infura.io/v3/${INFURA_ID}`,
    [ChainId.Polygon]: `https://ropsten.infura.io/v3/${INFURA_ID}`,
  },
  supportedChains: [
    ChainId.Localhost,
    ChainId.Mumbai,
    ChainId.Polygon,
  ],
  multicallAddresses: {
    ...MULTICALL_ADDRESSES,
    [ChainId.Localhost]: MulticallContract,
    [ChainId.Mumbai]: MulticallContract,
    [ChainId.Polygon]: MulticallContract,
  },
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApollo(pageProps)
  return (
    <ApolloProvider client={apolloClient}>
      <DAppProvider config={config}>
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
