import { Wrapper } from '@components/layout/Wrapper'
import { FC, useEffect, useState } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { SpinnerDiamond } from 'spinners-react'
import 'twin.macro'
import tw, { theme } from 'twin.macro'

export interface HomeHeroKPIsProps {}
export const HomeHeroKPIs: FC<HomeHeroKPIsProps> = () => {
  const [isDemoLoading, setIsDemoLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setIsDemoLoading(false)
    }, 1500)
  }, [])

  return (
    <>
      <h2 tw="sr-only">Stake for Earth in Numbers (KPIs)</h2>
      <div tw="bg-primary-100">
        <Wrapper noVerticalPadding>
          <div tw="-mx-4 grid divide-y divide-black/10 sm:-mx-8 lg:(mx-0 grid-cols-3 divide-y-0 divide-x)">
            <HomeHeroKPIItem
              label="Total amount"
              value={11140456}
              numericFormatProps={{ prefix: '$' }}
              tw="lg:pl-0"
              isLoading={isDemoLoading}
            />
            <HomeHeroKPIItem label="Number of stakers" value={23140} isLoading={isDemoLoading} />
            <HomeHeroKPIItem
              label="Last stake"
              description="10 min ago by 0x23rw...i29d"
              value={30}
              numericFormatProps={{ prefix: '$', fixedDecimalScale: true, decimalScale: 2 }}
              tw="lg:pr-0"
              isLoading={isDemoLoading}
            />
          </div>
        </Wrapper>
      </div>
    </>
  )
}

export interface HomeHeroKPIItemProps {
  value: number
  label: string
  description?: string
  numericFormatProps?: NumericFormatProps
  isLoading?: boolean
}
export const HomeHeroKPIItem: FC<HomeHeroKPIItemProps> = ({
  value,
  label,
  description,
  numericFormatProps,
  isLoading,
  ...props
}) => {
  return (
    <>
      <div
        tw="flex flex-col items-center justify-between space-y-2 px-14 py-6 min-h-[6.25rem] xs:(flex-row space-x-4 space-y-0)"
        {...props}
      >
        <div css={[tw`text-sm`, isLoading ? tw`animate-pulse text-gray-800` : tw`text-black`]}>
          {label}
        </div>
        <div tw="flex flex-col whitespace-nowrap text-center xs:text-right">
          {isLoading ? (
            <SpinnerDiamond
              size={32}
              thickness={125}
              color={theme('colors.primary.500')}
              secondaryColor={theme('colors.primary.300')}
              tw="mt-1 xs:mt-0"
            />
          ) : (
            <>
              <NumericFormat
                value={value}
                displayType={'text'}
                thousandSeparator={true}
                tw="font-display font-bold leading-none text-[1.95rem]"
                {...numericFormatProps}
              />
              {description && <div tw="mt-1 text-xs opacity-75">{description}</div>}
            </>
          )}
        </div>
      </div>
    </>
  )
}
