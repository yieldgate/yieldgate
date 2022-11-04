import { Wrapper } from '@components/layout/Wrapper'
import { Subheading, SubheadingSmall } from '@components/shared/Subheading'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import carsStockImg from 'public/images/stocks/cars.jpg'
import forestStockImg from 'public/images/stocks/forest.jpg'
import gasolineStockImg from 'public/images/stocks/gasoline.jpg'
import { FC } from 'react'
import { NumericFormat } from 'react-number-format'
import 'twin.macro'
import { HomeCarbonTonnesCountUp } from './HomeCarbonTonnesCountUp'

export interface HomeCarbonExamplesSectionProps {}
export const HomeCarbonExamplesSection: FC<HomeCarbonExamplesSectionProps> = () => {
  return (
    <>
      <div tw="bg-gray-100">
        <Wrapper>
          <div tw="flex flex-col items-center">
            <SubheadingSmall noHeadingMarkup={true}>
              Tons of carbon offsetted by Stake for Earth
            </SubheadingSmall>
            <Subheading>
              <HomeCarbonTonnesCountUp subtitle="which equals" tw="items-center" />
            </Subheading>

            {/* Carbon Example Items */}
            <div tw="mt-8 grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <HomeCarbonExampleItem
                imgSrc={forestStockImg}
                value={87010}
                title="Hectars of Forest"
                sourceUrl="https://google.com"
              />
              <HomeCarbonExampleItem
                imgSrc={carsStockImg}
                value={3783055}
                title="Cars (annual)"
                sourceUrl="https://google.com"
                tw="hidden md:block"
              />
              <HomeCarbonExampleItem
                imgSrc={gasolineStockImg}
                value={516661495}
                title="Liters of gasoline"
                sourceUrl="https://google.com"
              />
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  )
}

export interface HomeCarbonExampleItemProps {
  imgSrc: any
  value: number
  title: string
  sourceUrl?: string
}
export const HomeCarbonExampleItem: FC<HomeCarbonExampleItemProps> = ({
  imgSrc,
  value,
  title,
  sourceUrl,
  ...props
}) => {
  return (
    <>
      <div tw="relative overflow-hidden rounded max-w-[20rem]" {...props}>
        <div tw="absolute inset-0 z-10 flex flex-col items-start justify-end bg-gradient-to-t from-[rgba(0,0,0,1)] via-[rgba(0,0,0,0)] to-[rgba(0,0,0,0)]">
          <div tw="py-6 px-8 text-white">
            <NumericFormat
              value={value}
              displayType={'text'}
              thousandSeparator={true}
              tw="font-display font-bold text-2xl leading-none lg:text-3xl"
            />
            <div tw="flex items-center">
              <div tw="mt-1 text-white/75 text-xs lg:text-sm">{title}</div>
              {sourceUrl && (
                <Link href={sourceUrl} target="_blank" title="Source">
                  <InformationCircleIcon tw="ml-1 h-4 w-4 translate-y-px cursor-pointer opacity-40 hover:opacity-80" />
                </Link>
              )}
            </div>
          </div>
        </div>
        <Image src={imgSrc} alt={title} tw="z-0 select-none" />
      </div>
    </>
  )
}
