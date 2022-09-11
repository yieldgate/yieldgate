import { chains, wagmiClient } from '@lib/wagmiClient'
import { lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import Router from 'next/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { WagmiConfig } from 'wagmi'
import '../styles/tailwind.css'

// Router Loading Animation with @tanem/react-nprogress
Router.events.on('routeChangeStart', () => nProgress.start())
Router.events.on('routeChangeComplete', () => nProgress.done())
Router.events.on('routeChangeError', () => nProgress.done())

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <DefaultSeo
        defaultTitle="StakeForEarth"
        description="Do something good for our climate at zero cost. – All with yield."
        openGraph={{
          type: 'website',
          locale: 'en',
          url: 'https://stakefor.earth',
          site_name: 'StakeForEarth',
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

      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={lightTheme({
            accentColor: '#edf2f7',
            accentColorForeground: '#1a202c',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
