import { chains, wagmiClient } from '@lib/wagmiClient'
import { DisclaimerComponent, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { FC, PropsWithChildren } from 'react'
import 'twin.macro'
import { WagmiConfig } from 'wagmi'

export interface Web3WrapperProps {}
export const Web3Wrapper: FC<PropsWithChildren<Web3WrapperProps>> = ({ children }) => {
  const RainbowKitDisclaimer: DisclaimerComponent = ({ Text, Link }) => (
    <Text>
      By connecting your wallet, you agree to our{' '}
      <Link href="/legal/terms">Terms and Conditions</Link> and acknowledge you have read and
      understand our <Link href="/legal/privacy">Privacy Policy</Link>.
    </Text>
  )

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          appInfo={{ appName: 'Stake for Earth', disclaimer: RainbowKitDisclaimer }}
          chains={chains}
          theme={lightTheme({
            accentColor: '#000',
            accentColorForeground: '#FFF',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  )
}
