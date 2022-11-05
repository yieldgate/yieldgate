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
      <div tw="relative grid min-h-full">
        <div tw="flex">
          {/* Aside (Logo) */}
          <PaddingWrapperAside tw="sticky top-0 hidden shrink-0 grow overflow-hidden bg-primary-100 h-[100vh] max-w-[30vw] md:flex">
            <div tw="flex flex-col lg:pr-12 xl:pr-28">
              <StakeForEarthLogo tw="hidden lg:flex" href="/" />
              <div tw="absolute left-1/2 z-0 h-full -translate-x-1/2 select-none opacity-50 w-[120%] min-w-[500px] bottom-[-10vw]">
                <Image
                  src={circleElementSvg}
                  fill
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'center bottom',
                  }}
                  sizes="33vw"
                  alt="Decorative Element"
                  priority
                />
              </div>
            </div>
          </PaddingWrapperAside>

          {/* Main Body (Form) */}
          <PaddingWrapper tw="flex grow flex-col py-6 px-4 sm:(py-8 px-8) lg:py-12">
            {/* Logo (on small) */}
            <div tw="mt-2 mb-8 flex items-center justify-center sm:(mt-0 mb-10) lg:hidden">
              <StakeForEarthLogo href="/" />
            </div>

            <main tw="grow">{children}</main>
          </PaddingWrapper>
        </div>
      </div>
    </>
  )
}
