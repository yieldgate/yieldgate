import { StakingLayout } from '@components/staking/StakingLayout'
import { NextSeo } from 'next-seo'
import 'twin.macro'

export interface StakingPageProps {}
export default function StakingPage() {
  return (
    <>
      <NextSeo title="Stake & Dontation Form" />
      <StakingLayout>
        {/* TODO */}
        StakingPage
      </StakingLayout>
    </>
  )
}
