import { StakeForEarthLogo } from '@components/brand/StakeForEarthLogo'
import Image from 'next/image'
import circleElementSvg from 'public/images/decorative-circle-element.svg'
import { FC, PropsWithChildren } from 'react'
import 'twin.macro'
import tw, { styled } from 'twin.macro'

const PaddingWrapper = styled.div(() => [
  tw`px-4 py-4 sm:(py-8 px-8) lg:(py-12 px-10) xs:(py-6 px-6)`,
])
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
          <PaddingWrapper tw="flex grow flex-col p-0 sm:p-0 lg:(px-8 py-12) xs:p-0">
            {/* Logo (on small) */}
            <div tw="mb-6 flex items-center justify-center bg-gray-100 py-5 sm:mb-10 md:(mt-4 mb-6 bg-transparent) lg:hidden">
              <StakeForEarthLogo href="/" />
            </div>

            <main tw="grow px-4 pb-4 sm:(px-8 pb-8) xs:(px-6 pb-6)">{children}</main>
          </PaddingWrapper>
        </div>
      </div>
    </>
  )
}
