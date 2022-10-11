import {
  StakingHorizontalStepper,
  StakingStepperItem,
} from '@components/staking/StakingHorizontalStepper'
import { StakingLayout } from '@components/staking/StakingLayout'
import { StakingViewConnect } from '@components/staking/StakingViewConnect'
import { StakingViewPrepareFunds } from '@components/staking/StakingViewPrepareFunds'
import { StakingViewStakeDonate } from '@components/staking/StakingViewStakeDonate'
import { truncateHash } from '@lib/truncateHash'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import 'twin.macro'
import { useAccount } from 'wagmi'

export interface StakingPageProps {}
export default function StakingPage() {
  const { address } = useAccount()
  const { pathname } = useRouter()
  const [stepperItems, setStepperItems] = useState<StakingStepperItem[]>([])
  useEffect(() => {
    const stepperItems: StakingStepperItem[] = [
      {
        title: 'Connect Wallet',
        shortTitle: 'Connect',
        component: StakingViewConnect,
        ...(address && { subTitle: truncateHash(address) }),
      },
      {
        title: 'Prepare Funds',
        shortTitle: 'Prepare',
        component: StakingViewPrepareFunds,
        disabled: !address,
      },
      {
        title: pathname === '/donate' ? 'Donate' : 'Stake',
        component: StakingViewStakeDonate,
        disabled: !address,
      },
    ]
    setStepperItems(stepperItems)
  }, [address, pathname])

  return (
    <>
      <NextSeo title="Stake & Dontation Form" />
      <StakingLayout>
        <StakingHorizontalStepper items={stepperItems} />
      </StakingLayout>
    </>
  )
}
