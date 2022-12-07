import { env } from '@lib/environment'
import Image from 'next/image'
import Link from 'next/link'
import logoIcon from 'public/brand/sfe-logo.svg'
import { FC } from 'react'
import 'twin.macro'
import tw from 'twin.macro'
import { useNetwork } from 'wagmi'

export interface StakeForEarthLogoProps {
  href?: string
  hideTextOn?: 'lg' | 'md' | 'sm' | 'xs'
  // hideText?: boolean
}
export const StakeForEarthLogo: FC<StakeForEarthLogoProps> = ({ href, hideTextOn, ...props }) => {
  const { chain } = useNetwork()

  const StakeForEarthLogoInner: FC = () => (
    <div tw="flex items-center space-x-3" {...props}>
      <div tw="flex shrink-0 items-center justify-center">
        <Image src={logoIcon} width={34} height={30} alt="Stake For Earth Logo" priority />
      </div>
      <div
        tw="flex flex-col items-start justify-center whitespace-nowrap!"
        css={[
          hideTextOn === 'lg' && tw`sr-only lg:not-sr-only`,
          hideTextOn === 'md' && tw`sr-only md:not-sr-only`,
          hideTextOn === 'sm' && tw`sr-only sm:not-sr-only`,
          hideTextOn === 'xs' && tw`sr-only xs:not-sr-only`,
        ]}
      >
        <div tw="font-body font-medium text-2xl tracking-tighter">Stake for Earth</div>
        {(!!chain?.testnet || !env.isProduction) && (
          <div tw="rounded-full bg-yellow-100 from-gray-700 px-1.5 py-0.5 font-medium text-[10px]">
            Test Environment
          </div>
        )}
      </div>
    </div>
  )

  return href ? (
    <Link href={href} tw="cursor-pointer">
      <StakeForEarthLogoInner />
    </Link>
  ) : (
    <StakeForEarthLogoInner />
  )
}
