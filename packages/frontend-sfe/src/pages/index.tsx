import { HomeBackedBySection } from '@components/home/HomeBackedBySection'
import { HomeHero } from '@components/home/HomeHero'
import { HomeHeroKPIs } from '@components/home/HomeHeroKPIs'
import { HomeHowItWorksSection } from '@components/home/HomeHowItWorksSection'
import { HomeLayout } from '@components/home/HomeLayout'
import { HomePrimaryTextSection } from '@components/home/HomePrimaryTextSection'
import 'twin.macro'

export interface IndexPageProps {}
export default function IndexPage() {
  return (
    <>
      <HomeLayout>
        <HomeHero />
        <HomeHeroKPIs />
        <HomeBackedBySection />
        <HomePrimaryTextSection />
        <HomeHowItWorksSection />
      </HomeLayout>
    </>
  )
}
