import { StakeForEarthLogo } from '@components/brand/StakeForEarthLogo'
import { FC, PropsWithChildren } from 'react'
import 'twin.macro'
import tw, { styled } from 'twin.macro'

const PaddingWrapper = styled.div(() => [tw`py-6 px-6 sm:(py-8 px-8) lg:(py-12 px-10)`])
const PaddingWrapperAside = PaddingWrapper.withComponent('aside')
const PaddingWrapperMain = PaddingWrapper.withComponent('main')

export interface StakingLayoutProps {}
export const StakingLayout: FC<PropsWithChildren<StakingLayoutProps>> = ({ children }) => {
  return (
    <>
      <div tw="flex h-full">
        <PaddingWrapperAside tw="h-full bg-gray-100">
          <StakeForEarthLogo hideTextOn="sm" href="/" />
        </PaddingWrapperAside>
        <PaddingWrapperMain tw="max-w-[1000px] py-6 px-4 sm:(py-8 px-8) lg:py-12">
          {children}
        </PaddingWrapperMain>
      </div>
    </>
  )
}
