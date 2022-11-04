import { Wrapper } from '@components/layout/Wrapper'
import { FC } from 'react'
import CountUp from 'react-countup'
import 'twin.macro'
import { HomeHeroIllustration } from './HomeHeroIllustration'
import { HomeNewsletterSubscribeForm } from './HomeNewsletterSection'

export interface HomeHeroProps {}
export const HomeHero: FC<HomeHeroProps> = () => {
  return (
    <>
      <div tw="relative flex items-center overflow-hidden h-[60vh] min-h-[33rem] lg:h-[70vh]">
        {/* Text Content */}
        <Wrapper tw="z-10">
          <div tw="space-y-10 max-w-[22rem] pb-[2.5vh] sm:px-4 lg:(max-w-[30rem] pb-[5vh])">
            {/* Tagline */}
            <p tw="font-display font-bold text-4xl tracking-tight lg:text-5xl">
              Compounding yield to enable climate action at 0 cost
            </p>

            {/* Burned KPI */}
            <div tw="flex flex-col">
              <div tw="whitespace-nowrap font-display font-bold text-4xl leading-none min-h-[1em] lg:text-5xl">
                <CountUp end={238477} duration={2.5} separator="," decimals={0} />
              </div>
              <div tw="mt-2 text-sm opacity-75">carbon credits burned</div>
            </div>

            {/* Staking CTAs */}
            {/* <HomeCTAs primaryFirst={true} tw="text-base" /> */}

            {/* Newsletter CTA */}
            <div>
              <div tw="mb-2 font-medium text-gray-800 text-sm uppercase">
                Subscribe to our Newsletter
              </div>
              <HomeNewsletterSubscribeForm />
            </div>
          </div>
        </Wrapper>

        {/* Illustration BG */}
        <HomeHeroIllustration />
      </div>
    </>
  )
}
