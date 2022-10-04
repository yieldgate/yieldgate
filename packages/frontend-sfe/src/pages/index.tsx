import { HomeHero } from '@components/home/HomeHero'
import { HomeHeroKPIs } from '@components/home/HomeHeroKPIs'
import { HomeLayout } from '@components/home/HomeLayout'
import 'twin.macro'

export interface IndexPageProps {}
export default function IndexPage() {
  return (
    <>
      <HomeLayout>
        <HomeHero />
        <HomeHeroKPIs />
      </HomeLayout>
    </>
  )
}
