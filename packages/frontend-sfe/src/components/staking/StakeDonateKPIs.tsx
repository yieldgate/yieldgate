import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { FC } from 'react'
import 'twin.macro'
import tw, { styled } from 'twin.macro'
import {
  StakingStepperItemContentBox,
  StakingStepperItemContentBoxDivider,
  StakingStepperItemContentBoxHeadline,
} from './StakingStepperItemSharedComponents'
import { StakingViewStakeDonateMode } from './StakingViewStakeDonate'

const StakeDonateKPI = styled.div(() => [tw`m-1 rounded bg-gray-100 py-3 px-4 space-y-1`])
const StakeDonateKPITitle = styled.h4(() => [tw`text-sm text-gray-500`])
const StakeDonateKPIValue = styled.p(() => [tw`text-xl font-bold tracking-tight`])

export interface StakeDonateKPIsProps {
  mode: StakingViewStakeDonateMode
}
export const StakeDonateKPIs: FC<StakeDonateKPIsProps> = ({ mode }) => {
  return (
    <>
      <StakingStepperItemContentBox>
        <StakingStepperItemContentBoxHeadline>
          {mode === 'donate' ? 'Previous Donations' : 'Current Staking'}
        </StakingStepperItemContentBoxHeadline>

        {/* KPIs */}
        <div tw="grid grid-cols-3 -m-1">
          <StakeDonateKPI>
            <StakeDonateKPITitle>Impact (CO₂)</StakeDonateKPITitle>
            <StakeDonateKPIValue tw="text-green-500">100 kg</StakeDonateKPIValue>
          </StakeDonateKPI>
          <StakeDonateKPI>
            <StakeDonateKPITitle>Stake (USDC)</StakeDonateKPITitle>
            <StakeDonateKPIValue>1,000.00</StakeDonateKPIValue>
          </StakeDonateKPI>
          <StakeDonateKPI>
            <StakeDonateKPITitle>Duration</StakeDonateKPITitle>
            <StakeDonateKPIValue>30 days</StakeDonateKPIValue>
          </StakeDonateKPI>
        </div>

        <StakingStepperItemContentBoxDivider />

        {/* Actions */}
        <BaseButtonGroup>
          <BaseButton>Topup</BaseButton>
          <BaseButton variant="outline">Withdraw</BaseButton>
        </BaseButtonGroup>
      </StakingStepperItemContentBox>
    </>
  )
}
