import { HomeBackedBySection } from '@components/home/HomeBackedBySection'
import { HomeFAQsSection } from '@components/home/HomeFAQsSection'
import { HomeHero } from '@components/home/HomeHero'
import { HomeHeroKPIs } from '@components/home/HomeHeroKPIs'
import { HomeHowItWorksSection } from '@components/home/HomeHowItWorksSection'
import { HomeLayout } from '@components/home/HomeLayout'
import { HomeNewsletterSection } from '@components/home/HomeNewsletterSection'
import { HomePrimaryTextSection } from '@components/home/HomePrimaryTextSection'
import { HomeTweetWall } from '@components/home/HomeTweetWall'
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
        <HomeTweetWall />
        <HomeHowItWorksSection />
        <HomeFAQsSection />
        <HomeNewsletterSection />
      </HomeLayout>
    </>
  )
}
