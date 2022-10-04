import Image from 'next/image'
import logoIcon from 'public/brand/sfe-logo.svg'
import { FC } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface StakeForEarthLogoProps {
  hideTextOnSmall?: boolean
  // hideText?: boolean
  // noHeadingMarkup?: boolean
}
export const StakeForEarthLogo: FC<StakeForEarthLogoProps> = ({ hideTextOnSmall }) => {
  return (
    <>
      <div tw="flex items-center space-x-2">
        <Image src={logoIcon} width={32} height={32} alt="Stake For Earth Logo-Icon" />
        <h1
          css={[
            tw`font-body text-2xl font-medium tracking-tighter whitespace-nowrap`,
            hideTextOnSmall && tw`sr-only xs:not-sr-only`,
          ]}
        >
          Stake for Earth
        </h1>
      </div>
    </>
  )
}
