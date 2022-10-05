import Image from 'next/image'
import Link from 'next/link'
import logoIcon from 'public/brand/sfe-logo.svg'
import { FC } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface StakeForEarthLogoProps {
  href?: string
  hideTextOn?: 'sm' | 'xs'
  // hideText?: boolean
  // noHeadingMarkup?: boolean
}
export const StakeForEarthLogo: FC<StakeForEarthLogoProps> = ({ href, hideTextOn }) => {
  const StakeForEarthLogoInner: FC = () => (
    <div tw="flex items-center space-x-2">
      <div tw="flex justify-center items-center shrink-0">
        <Image src={logoIcon} priority={true} width={32} height={32} alt="Stake For Earth Logo" />
      </div>
      <h1
        css={[
          tw`font-body text-2xl font-medium tracking-tighter whitespace-nowrap!`,
          hideTextOn === 'sm' && tw`sr-only sm:not-sr-only`,
          hideTextOn === 'xs' && tw`sr-only xs:not-sr-only`,
        ]}
      >
        Stake for Earth
      </h1>
    </div>
  )

  return href ? (
    <Link href={href} passHref>
      <a tw="cursor-pointer">
        <StakeForEarthLogoInner />
      </a>
    </Link>
  ) : (
    <StakeForEarthLogoInner />
  )
}
