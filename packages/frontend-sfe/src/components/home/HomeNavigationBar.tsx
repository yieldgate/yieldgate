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
          <div tw="flex justify-between items-center">
            <StakeForEarthLogo hideTextOn="xs" />
            <HomeCTAs />
          </div>
        </Wrapper>
      </div>
    </>
  )
}
