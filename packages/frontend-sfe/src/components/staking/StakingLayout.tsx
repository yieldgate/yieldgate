import { StakeForEarthLogo } from '@components/brand/StakeForEarthLogo'
import Image from 'next/image'
import circleElementSvg from 'public/images/decorative-circle-element.svg'
import { FC, PropsWithChildren } from 'react'
import 'twin.macro'
import tw, { styled } from 'twin.macro'

const PaddingWrapper = styled.div(() => [tw`py-6 px-6 sm:(py-8 px-8) lg:(py-12 px-10)`])
const PaddingWrapperAside = PaddingWrapper.withComponent('aside')

export interface StakingLayoutProps {}
export const StakingLayout: FC<PropsWithChildren<StakingLayoutProps>> = ({ children }) => {
  return (
    <>
      <div tw="min-h-full grid relative">
        <div tw="flex">
          {/* Aside (Logo) */}
          <PaddingWrapperAside tw="hidden md:flex sticky top-0 h-[100vh] max-w-[30vw] bg-primary-100 shrink-0 grow overflow-hidden">
            <div tw="flex flex-col lg:pr-12 xl:pr-28">
              <StakeForEarthLogo tw="hidden lg:flex" href="/" />
              <div tw="w-[120%] min-w-[500px] justify-end absolute bottom-[-10vw] left-1/2 -translate-x-1/2 select-none opacity-50 z-0">
                <Image
                  src={circleElementSvg}
                  layout="responsive"
                  alt="Decorative Element"
                  priority={true}
                />
              </div>
            </div>
          </PaddingWrapperAside>

          {/* Main Body (Form) */}
          <PaddingWrapper tw="grow flex flex-col py-6 px-4 sm:(py-8 px-8) lg:py-12">
            {/* Logo (on small) */}
            <div tw="flex justify-center items-center mt-2 mb-8 sm:(mt-0 mb-10) lg:hidden">
              <StakeForEarthLogo href="/" />
            </div>

            <main tw="grow">{children}</main>
          </PaddingWrapper>
        </div>
      </div>
    </>
  )
}
