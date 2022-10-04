import { Wrapper } from '@components/layout/Wrapper'
import { FC } from 'react'
import 'twin.macro'

export interface HomeHeroProps {}
export const HomeHero: FC<HomeHeroProps> = () => {
  return (
    <>
      <Wrapper>Hero</Wrapper>
    </>
  )
}
