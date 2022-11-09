import { Web3Wrapper } from '@components/layout/Web3Wrapper'
import { cache } from '@emotion/css'
import { CacheProvider } from '@emotion/react'
import { env } from '@lib/environment'
import '@rainbow-me/rainbowkit/styles.css'
import GlobalStyles from '@styles/GlobalStyles'
import { domAnimation, LazyMotion } from 'framer-motion'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Toaster } from 'react-hot-toast'

// Router Loading Animation with @tanem/react-nprogress
Router.events.on('routeChangeStart', () => nProgress.start())
Router.events.on('routeChangeComplete', () => nProgress.done())
Router.events.on('routeChangeError', () => nProgress.done())

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <DefaultSeo
        // TODO
        dangerouslySetAllPagesToNoFollow={!env.isProduction}
        dangerouslySetAllPagesToNoIndex={!env.isProduction}
        defaultTitle="Stake for Earth – Carbon Offsetting with Yield"
        titleTemplate="%s | Stake for Earth – Carbon Offsetting with Yield"
        description="Do something good for our climate at zero cost. – All with yield."
        openGraph={{
          type: 'website',
          locale: 'en',
          url: 'https://stakefor.earth',
          site_name: 'Stake for Earth',
          // TODO
          // images: [
          //   {
          //     url: `${env.url}/og/og.jpg`,
          //     width: 1728,
          //     height: 972,
          //   },
          // ],
        }}
      />

      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <CacheProvider value={cache}>
        <GlobalStyles />

        <Web3Wrapper>
          <LazyMotion features={domAnimation}>
            <Component {...pageProps} />
          </LazyMotion>
        </Web3Wrapper>

        <Toaster
          toastOptions={{
            position: 'top-center',
            style: {
              borderRadius: '0px',
              border: '1px #e4e4e4 solid',
              boxShadow: 'none',
              background: 'white',
              maxWidth: '30rem',
            },
            success: {
              duration: 5000,
            },
          }}
        />
      </CacheProvider>
    </>
  )
}

export default MyApp
