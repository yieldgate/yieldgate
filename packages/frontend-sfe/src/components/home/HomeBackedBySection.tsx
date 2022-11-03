import { Wrapper } from '@components/layout/Wrapper'
import { SubheadingSmall } from '@components/shared/Subheading'
import Image from 'next/image'
import aaveSvg from 'public/images/logos/aave--black.svg'
import thegraphSvg from 'public/images/logos/thegraph--black.svg'
import toucanSvg from 'public/images/logos/toucan--black.svg'
// import coinbaseSvg from 'public/images/logos/coinbase--black.svg'
// import walletconnectSvg from 'public/images/logos/walletconnect--black.svg'
// import polygonSvg from 'public/images/logos/polygon--black.svg'
import { FC } from 'react'
import 'twin.macro'

export interface HomeBackedBySectionProps {}
export const HomeBackedBySection: FC<HomeBackedBySectionProps> = () => {
  const logos = [
    {
      name: 'AAVE',
      img: aaveSvg,
    },
    {
      name: 'Toucan',
      img: toucanSvg,
    },
    {
      name: 'The Graph',
      img: thegraphSvg,
    },
    // {
    //   name: 'WalletConnect',
    //   img: walletconnectSvg,
    // },
    // {
    //   name: 'Coinbase',
    //   img: coinbaseSvg,
    //   breakBefore: true,
    // },
    // {
    //   name: 'Polygon',
    //   img: polygonSvg,
    // },
  ]
  return (
    <>
      <Wrapper tw="overflow-hidden">
        <SubheadingSmall tw="text-center">Backed by</SubheadingSmall>
        <div tw="-mx-8 -my-2 mt-0 flex flex-wrap justify-center">
          {logos.map((logo) => (
            <div
              key={logo.name}
              tw="relative mx-8 my-2 items-center justify-center h-[50px] w-[150px]"
            >
              <Image
                src={logo.img}
                fill
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center center',
                }}
                alt={`${logo.name} Logo`}
                tw="opacity-30 transition-opacity hover:opacity-80"
              />
            </div>
          ))}
        </div>
      </Wrapper>
    </>
  )
}
