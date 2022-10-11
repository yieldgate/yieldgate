import {
  StakingHorizontalStepper,
  StakingStepperItem,
} from '@components/staking/StakingHorizontalStepper'
import { StakingLayout } from '@components/staking/StakingLayout'
import { StakingViewConnect } from '@components/staking/StakingViewConnect'
import { NextSeo } from 'next-seo'
import 'twin.macro'

export interface StakingPageProps {}
export default function StakingPage() {
  const stepperItems: StakingStepperItem[] = [
    {
      title: 'Connect Wallet',
      shortTitle: 'Connect',
      component: StakingViewConnect,
    },
    {
      title: 'Prepare Funds',
      shortTitle: 'Prepare',
      component: StakingViewConnect,
    },
    {
      title: 'Checkout',
      component: StakingViewConnect,
    },
  ]

  return (
    <>
      <NextSeo title="Stake & Dontation Form" />
      <StakingLayout>
        <StakingHorizontalStepper items={stepperItems} />
      </StakingLayout>
    </>
  )
}
