import { HomeBackedBySection } from '@components/home/HomeBackedBySection'
import { HomeFAQsSection } from '@components/home/HomeFAQsSection'
import { HomeHero } from '@components/home/HomeHero'
import { HomeHeroKPIs } from '@components/home/HomeHeroKPIs'
import { HomeHowItWorksSection } from '@components/home/HomeHowItWorksSection'
import { HomeLayout } from '@components/home/HomeLayout'
import { HomeNewsletterSection } from '@components/home/HomeNewsletterSection'
import { HomePrimaryTextSection } from '@components/home/HomePrimaryTextSection'
import { HomeStaticTweetWall } from '@components/home/HomeTweetWall'
import 'twin.macro'

export interface IndexPageProps {}
export default function IndexPage() {
  return (
    <>
      <HomeLayout>
        <h1 tw="sr-only">Stake for Earth</h1>
        <HomeHero />
        <HomeHeroKPIs />
        <HomeBackedBySection />
        <HomePrimaryTextSection />
        <HomeStaticTweetWall />
        <HomeHowItWorksSection />
        <HomeFAQsSection />
        <HomeNewsletterSection />
      </HomeLayout>
    </>
  )
}
