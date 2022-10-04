import { StakeForEarthLogo } from '@components/brand/StakeForEarthLogo'
import { Wrapper } from '@components/layout/Wrapper'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FC } from 'react'
import 'twin.macro'

export interface HomeNavigationBarProps {}
export const HomeNavigationBar: FC<HomeNavigationBarProps> = () => {
  return (
    <>
      <div tw="bg-gray-100">
        <Wrapper noVerticalPadding tw="py-5">
          <div tw="flex justify-between">
            <StakeForEarthLogo />
            <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
          </div>
        </Wrapper>
      </div>
    </>
  )
}
