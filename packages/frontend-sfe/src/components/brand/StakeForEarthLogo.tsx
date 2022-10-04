import Image from 'next/image'
import logoIcon from 'public/brand/sfe-logo.svg'
import { FC } from 'react'
import 'twin.macro'

export interface StakeForEarthLogoProps {
  // hideText?: boolean
  // hideTextOnSmall?: boolean
  // noHeadingMarkup?: boolean
}
export const StakeForEarthLogo: FC<StakeForEarthLogoProps> = () => {
  return (
    <>
      <div tw="flex items-center space-x-2">
        <Image src={logoIcon} width={32} height={32} alt="Stake For Earth Logo-Icon" />
        <h1 tw="font-body text-2xl font-medium tracking-tighter whitespace-nowrap">
          Stake for Earth
        </h1>
      </div>
    </>
  )
}
