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
      <div tw="bg-gray-100">
        <Wrapper noVerticalPadding>
          <div tw="grid divide-y divide-gray-300 -mx-4 sm:(-mx-8) lg:(grid-cols-3 divide-y-0 divide-x mx-0)">
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
        tw="flex flex-col min-h-[6.25rem] space-y-1 xs:(flex-row space-x-2 space-y-0) items-center justify-between px-14 py-6"
        {...props}
      >
        <div css={[tw`text-sm`, isLoading ? tw`text-gray-800 animate-pulse` : tw`text-black`]}>
          {label}
        </div>
        <div tw="flex flex-col whitespace-nowrap text-center xs:(text-right)">
          {isLoading ? (
            <SpinnerDiamond
              size={34}
              thickness={120}
              color={theme('colors.gray.500')}
              secondaryColor={theme('colors.gray.300')}
            />
          ) : (
            <>
              <NumericFormat
                value={value}
                displayType={'text'}
                thousandSeparator={true}
                tw="text-3xl font-display font-bold"
                {...numericFormatProps}
              />
              {description && <div tw="text-xs opacity-75">{description}</div>}
            </>
          )}
        </div>
      </div>
    </>
  )
}
