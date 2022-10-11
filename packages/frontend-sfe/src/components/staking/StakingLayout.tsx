import { StakeForEarthLogo } from '@components/brand/StakeForEarthLogo'
import Image from 'next/image'
import circleElementSvg from 'public/images/decorative-circle-element.svg'
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
        {/* Aside (Logo) */}
        <PaddingWrapperAside tw="h-full relative bg-gray-100 overflow-hidden">
          <div tw="flex flex-col pr-24">
            <StakeForEarthLogo hideTextOn="md" href="/" />
            <div tw="absolute left-1/2 bottom-[-3rem] -translate-x-1/2 select-none opacity-50 z-0">
              <Image
                src={circleElementSvg}
                width={500}
                height={500}
                layout="fixed"
                alt="Decorative Element"
                priority={true}
              />
            </div>
          </div>
        </PaddingWrapperAside>

        {/* Main Body (Form) */}
        <PaddingWrapperMain tw="grow max-w-[1000px] py-6 px-4 sm:(py-8 px-8) lg:py-12">
          {children}
        </PaddingWrapperMain>
      </div>
    </>
  )
}
