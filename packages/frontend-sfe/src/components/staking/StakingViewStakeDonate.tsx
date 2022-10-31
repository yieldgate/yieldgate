import { FC } from 'react'
import 'twin.macro'
import { StakeDonateForm } from './StakeDonateForm'
import { StakeDonateKPIs } from './StakeDonateKPIs'
import { StakingStepperItemComponentProps } from './StakingStepper'
import {
  StakingStepperItemBody,
  StakingStepperItemHeadline,
  StakingStepperItemOuterWrapper,
} from './StakingStepperItemSharedComponents'

export interface StakingViewStakeDonateProps extends StakingStepperItemComponentProps {}
export const StakingViewStakeDonate: FC<StakingViewStakeDonateProps> = (props) => {
  const { mode } = props

  return (
    <>
      <StakingStepperItemOuterWrapper>
        <StakingStepperItemHeadline>
          {mode === 'donate' ? 'Donate' : 'Stake'}
        </StakingStepperItemHeadline>
        <StakingStepperItemBody>
          <StakeDonateForm {...props} />
          <StakeDonateKPIs {...props} />
        </StakingStepperItemBody>
      </StakingStepperItemOuterWrapper>
    </>
  )
}
