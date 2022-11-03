import { StakeForEarthLogo } from '@components/brand/StakeForEarthLogo'
import { Wrapper } from '@components/layout/Wrapper'
import { FC } from 'react'
import 'twin.macro'
import { HomeCTAs } from './HomeCTAs'

export interface HomeNavigationBarProps {}
export const HomeNavigationBar: FC<HomeNavigationBarProps> = () => {
  return (
    <>
      <div tw="bg-gray-100">
        <Wrapper noVerticalPadding tw="py-5">
          <div tw="flex items-center justify-between">
            <StakeForEarthLogo hideTextOn="xs" href="/" />
            <HomeCTAs />
          </div>
        </Wrapper>
      </div>
    </>
  )
}
