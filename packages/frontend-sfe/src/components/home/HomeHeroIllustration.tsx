import Image from 'next/image'
import illustrationImg from 'public/images/hero-illustration-draft.png'
import { FC } from 'react'
import 'twin.macro'

export interface HomeHeroIllustrationProps {}
export const HomeHeroIllustration: FC<HomeHeroIllustrationProps> = ({ ...props }) => {
  return (
    <>
      <div tw="absolute inset-0 z-0 select-none overflow-hidden" {...props}>
        <Image
          src={illustrationImg}
          fill
          style={{
            objectFit: 'contain',
            objectPosition: 'right bottom',
          }}
          alt="Decorative Earth Illustration by Liam Cobb"
          priority
        />
      </div>
    </>
  )
}
