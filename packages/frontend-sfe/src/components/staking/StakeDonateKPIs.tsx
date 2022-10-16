import { FC } from 'react'
import 'twin.macro'
import {
  StakingStepperItemContentBox,
  StakingStepperItemContentBoxHeadline,
} from './StakingStepperItemSharedComponents'
import { StakingViewStakeDonateMode } from './StakingViewStakeDonate'

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
      </StakingStepperItemContentBox>
    </>
  )
}
