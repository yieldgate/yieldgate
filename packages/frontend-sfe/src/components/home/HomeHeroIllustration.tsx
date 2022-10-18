import Image from 'next/image'
import illustrationImg from 'public/images/hero-illustration-draft-7.png'
import { FC } from 'react'
import 'twin.macro'

export interface HomeHeroIllustrationProps {}
export const HomeHeroIllustration: FC<HomeHeroIllustrationProps> = ({ ...props }) => {
  return (
    <>
      <div
        tw="max-h-[100%] w-full flex flex-col absolute bottom-0 right-0 z-0 select-none overflow-hidden"
        {...props}
      >
        <Image
          src={illustrationImg}
          priority={true}
          objectFit="contain"
          objectPosition="right bottom"
          alt="Decorative Earth Illustration by Liam Cobb"
        />
      </div>
    </>
  )
}
