import { StakeDonateAllowanceProvider } from '@components/staking/StakeDonateAllowanceProvider'
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
import { useDeployments } from '@lib/useDeployments'
import { ToucanOffsetter__factory } from '@yieldgate/contracts/typechain-types'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import 'twin.macro'
import { useAccount, useEnsName, useNetwork, useProvider } from 'wagmi'

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
        title: pathname === '/donate' ? 'Donate' : 'Manage Stake',
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

  // Listen Event
  // TODO Refactor
  const { contracts, usedChainId } = useDeployments()
  const provider = useProvider({ chainId: usedChainId })
  const listenEvents = async () => {
    if (!contracts?.ToucanOffsetter?.address || !provider) return
    const contract = ToucanOffsetter__factory.connect(contracts.ToucanOffsetter.address, provider)
    const filter = contract.filters.Offset(
      '0x7ab4fCFCd4F108cdC43D591C0546aC7cfC36fd6B',
      null,
      '0x7beCBA11618Ca63Ead5605DE235f6dD3b25c530E',
      null
    )
    const logs = await contract.queryFilter(filter, 29521695, 'latest')
    console.log(logs)
  }
  useEffect(() => {
    listenEvents()
  }, [contracts?.ToucanOffsetter?.address, provider])

  return (
    <>
      <NextSeo title="Stake & Dontation Form" />
      <StakingLayout>
        <StakeDonateAllowanceProvider>
          <StakingStepper items={stepperItems} mode={mode} />
        </StakeDonateAllowanceProvider>
      </StakingLayout>
    </>
  )
}
