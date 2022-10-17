import { StakingLayout } from '@components/staking/StakingLayout'
import {
  StakingStepper,
  StakingStepperItem,
  StakingViewStakeDonateMode,
} from '@components/staking/StakingStepper'
import { StakingViewConnect } from '@components/staking/StakingViewConnect'
import { StakingViewPrepareFunds } from '@components/staking/StakingViewPrepareFunds'
import { StakingViewStakeDonate } from '@components/staking/StakingViewStakeDonate'
import { StakingViewSuccess } from '@components/staking/StakingViewSuccess'
import { truncateHash } from '@lib/truncateHash'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import 'twin.macro'
import { useAccount, useEnsName, useNetwork } from 'wagmi'

export interface StakingPageProps {}
export default function StakingPage() {
  const { pathname } = useRouter()
  const [mode] = useState<StakingViewStakeDonateMode>(pathname === '/donate' ? 'donate' : 'stake')
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const [stepperItems, setStepperItems] = useState<StakingStepperItem[]>([])
  useEffect(() => {
    const isConnected = !!address && !chain?.unsupported
    const stepperItems: StakingStepperItem[] = [
      {
        title: 'Connect Wallet',
        shortTitle: 'Connect',
        component: StakingViewConnect,
        ...(isConnected
          ? { subTitle: ensName || truncateHash(address) }
          : chain?.unsupported && { subTitle: 'Unsupported Chain' }),
      },
      {
        title: 'Prepare Funds',
        shortTitle: 'Prepare',
        component: StakingViewPrepareFunds,
        disabled: !isConnected,
      },
      {
        title: pathname === '/donate' ? 'Donate' : 'Stake',
        component: StakingViewStakeDonate,
        disabled: !isConnected,
      },
      {
        title: 'Confirmation',
        component: StakingViewSuccess,
        disabled: !isConnected,
        invisible: true,
      },
    ]
    setStepperItems(stepperItems)
  }, [address, ensName, chain?.unsupported, pathname])

  return (
    <>
      <NextSeo title="Stake & Dontation Form" />
      <StakingLayout>
        <StakingStepper items={stepperItems} mode={mode} />
      </StakingLayout>
    </>
  )
}
