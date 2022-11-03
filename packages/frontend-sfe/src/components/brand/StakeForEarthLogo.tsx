import Image from 'next/image'
import Link from 'next/link'
import logoIcon from 'public/brand/sfe-logo.svg'
import { FC } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface StakeForEarthLogoProps {
  href?: string
  hideTextOn?: 'lg' | 'md' | 'sm' | 'xs'
  // hideText?: boolean
}
export const StakeForEarthLogo: FC<StakeForEarthLogoProps> = ({ href, hideTextOn, ...props }) => {
  const StakeForEarthLogoInner: FC = () => (
    <div tw="flex items-center space-x-2" {...props}>
      <div tw="flex shrink-0 items-center justify-center">
        <Image src={logoIcon} width={32} height={32} alt="Stake For Earth Logo" priority />
      </div>
      <div
        css={[
          tw`whitespace-nowrap! font-body font-medium text-2xl tracking-tighter`,
          hideTextOn === 'lg' && tw`sr-only lg:not-sr-only`,
          hideTextOn === 'md' && tw`sr-only md:not-sr-only`,
          hideTextOn === 'sm' && tw`sr-only sm:not-sr-only`,
          hideTextOn === 'xs' && tw`sr-only xs:not-sr-only`,
        ]}
      >
        Stake for Earth
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
