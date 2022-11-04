import { FC } from 'react'
import CountUp from 'react-countup'
import 'twin.macro'

export interface HomeCarbonTonnesCountUpProps {
  subtitle?: string
}
export const HomeCarbonTonnesCountUp: FC<HomeCarbonTonnesCountUpProps> = ({
  subtitle,
  ...props
}) => {
  return (
    <>
      <div tw="flex flex-col" {...props}>
        <div tw="whitespace-nowrap font-display font-bold text-4xl leading-none min-h-[1em] lg:text-5xl">
          <CountUp end={238477} duration={2.5} separator="," decimals={0} />
        </div>
        {subtitle && (
          <div tw="mt-2 font-normal font-body text-black/70 text-sm tracking-normal">
            {subtitle}
          </div>
        )}
      </div>
    </>
  )
}
