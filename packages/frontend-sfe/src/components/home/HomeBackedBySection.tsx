import { Wrapper } from '@components/layout/Wrapper'
import Image from 'next/image'
import aaveSvg from 'public/images/logos/aave--black.svg'
import coinbaseSvg from 'public/images/logos/coinbase--black.svg'
import thegraphSvg from 'public/images/logos/thegraph--black.svg'
import toucanSvg from 'public/images/logos/toucan--black.svg'
import walletconnectSvg from 'public/images/logos/walletconnect--black.svg'
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
    {
      name: 'WalletConnect',
      img: walletconnectSvg,
    },
    {
      name: 'Coinbase',
      img: coinbaseSvg,
      breakBefore: true,
    },
    // {
    //   name: 'Polygon',
    //   img: polygonSvg,
    // },
  ]
  return (
    <>
      <Wrapper tw="max-w-[40rem] overflow-hidden">
        <h2 tw="text-center uppercase font-bold text-xs tracking-wide mb-8 text-gray-800">
          Backed by
        </h2>
        <div tw="flex flex-wrap justify-center -mx-8 -my-2">
          {logos.map((logo) => (
            <div
              key={logo.name}
              tw="h-[50px] max-w-[150px] mx-8 my-2 flex flex-col justify-center items-center"
            >
              <Image
                src={logo.img}
                objectFit="contain"
                objectPosition="center center"
                alt={`${logo.name} Logo`}
                tw="opacity-30 transition-opacity hover:(opacity-80)"
              />
            </div>
          ))}
        </div>
      </Wrapper>
    </>
  )
}
