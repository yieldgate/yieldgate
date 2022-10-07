import { Wrapper } from '@components/layout/Wrapper'
import { FC } from 'react'
import CountUp from 'react-countup'
import 'twin.macro'
import { HomeCTAs } from './HomeCTAs'
import { HomeHeroIllustration } from './HomeHeroIllustration'

export interface HomeHeroProps {}
export const HomeHero: FC<HomeHeroProps> = () => {
  return (
    <>
      <div tw="h-[60vh] pb-[2rem] lg:(h-[70vh] pb-[5rem]) min-h-[30rem] flex items-center relative overflow-hidden">
        {/* Text Content */}
        <Wrapper tw="z-10">
          <div tw="max-w-[24rem] lg:(max-w-[30rem]) sm:(px-4) space-y-8">
            {/* Tagline */}
            <p tw="text-4xl lg:(text-5xl) font-display font-bold">
              A bold vision statement that implies the value of climate action
            </p>

            {/* Burned KPI */}
            <div tw="flex flex-col">
              <div tw="text-4xl lg:(text-5xl) min-h-[1em] leading-none font-display font-bold whitespace-nowrap">
                <CountUp end={238477} duration={2.5} separator="," decimals={0} />
              </div>
              <div tw="text-sm opacity-75 mt-2">carbon credits burned</div>
            </div>

            {/* CTAs */}
            <HomeCTAs primaryFirst={true} />
          </div>
        </Wrapper>

        {/* Illustration BG */}
        <HomeHeroIllustration />
      </div>
    </>
  )
}
