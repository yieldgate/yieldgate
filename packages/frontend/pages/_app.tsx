import { ChakraProvider } from '@chakra-ui/react'
import { wagmiClient } from '@lib/wagmiClient'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import * as React from 'react'
import {
  Provider as WagmiProvider
} from 'wagmi'
import { env } from '../lib/environment'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return <>
    <DefaultSeo
      defaultTitle='Yieldgate.xyz'
      description='Receive donations, or support creators and access gated content. – All with yield.'
      openGraph={{
        type: 'website',
        locale: 'en',
        url: 'https://yieldgate.xyz',
        site_name: 'Yieldgate.xyz',
        images: [
          {
            url: `${env.url}/images/site-preview.png`,
            width: 1728,
            height: 972,
          },
        ],
      }}
    />

    <WagmiProvider client={wagmiClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </WagmiProvider>
  </>
}

export default MyApp
