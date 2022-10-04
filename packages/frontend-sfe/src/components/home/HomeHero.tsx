import { Wrapper } from '@components/layout/Wrapper'
import Image from 'next/image'
import illustrationImg from 'public/images/hero-illustration.png'
import { FC } from 'react'
import { NumericFormat } from 'react-number-format'
import 'twin.macro'

export interface HomeHeroProps {}
export const HomeHero: FC<HomeHeroProps> = () => {
  return (
    <>
      <div tw="h-[65vh] lg:(h-[75vh]) flex items-center pb-[10vh] relative overflow-hidden">
        {/* Text Content */}
        <Wrapper tw="z-10">
          <div tw="max-w-[30rem] sm:(px-4) space-y-8">
            {/* Tagline */}
            <p tw="text-5xl font-display font-bold">
              A bold vision statement that implies the value of climate action
            </p>

            {/* Burned KPI */}
            <div tw="flex flex-col">
              <div tw="text-5xl font-display font-bold">
                <NumericFormat value={10238477} displayType={'text'} thousandSeparator={true} />
              </div>
              <div tw="mt-2">carbon credits burned</div>
            </div>
          </div>
        </Wrapper>

        {/* Illustration BG */}
        <div tw="max-h-[90%] w-full flex flex-col absolute bottom-0 right-0 z-0 select-none overflow-hidden">
          <Image
            src={illustrationImg}
            height={1023}
            width={1888}
            objectFit="contain"
            objectPosition="right bottom"
            alt="Decorative Earth Illustration by Liam Cobb"
          />
        </div>
      </div>
    </>
  )
}
