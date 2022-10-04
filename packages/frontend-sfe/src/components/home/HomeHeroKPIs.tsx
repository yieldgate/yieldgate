import { Wrapper } from '@components/layout/Wrapper'
import { FC } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import 'twin.macro'

export interface HomeHeroKPIsProps {}
export const HomeHeroKPIs: FC<HomeHeroKPIsProps> = () => {
  return (
    <>
      <h2 tw="sr-only">Stake for Earth KPIs</h2>
      <div tw="bg-gray-100">
        <Wrapper noVerticalPadding>
          <div tw="grid divide-y divide-gray-400 -mx-4 sm:(-mx-8) lg:(grid-cols-3 divide-y-0 divide-x mx-0)">
            <HomeHeroKPIItem
              label="Total amount"
              value={11140456}
              numericFormatProps={{ prefix: '$' }}
              tw="lg:pl-0"
            />
            <HomeHeroKPIItem label="Number of stakers" value={23140} />
            <HomeHeroKPIItem
              label="Last stake"
              description="10 min ago by 0x23rw...i29d"
              value={30}
              numericFormatProps={{ prefix: '$', fixedDecimalScale: true, decimalScale: 2 }}
              tw="lg:pr-0"
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
}
export const HomeHeroKPIItem: FC<HomeHeroKPIItemProps> = ({
  value,
  label,
  description,
  numericFormatProps,
  ...props
}) => {
  return (
    <>
      <div tw="flex items-center justify-between px-14 py-6 space-x-2" {...props}>
        <div tw="text-sm">{label}</div>
        <div tw="flex flex-col whitespace-nowrap text-right">
          <NumericFormat
            value={value}
            displayType={'text'}
            thousandSeparator={true}
            tw="text-3xl font-display font-bold"
            {...numericFormatProps}
          />
          {description && <div tw="text-xs opacity-75">{description}</div>}
        </div>
      </div>
    </>
  )
}
