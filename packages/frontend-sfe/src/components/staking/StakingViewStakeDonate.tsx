import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import 'twin.macro'
import { StakeDonateBalance } from './StakeDonateBalance'
import { StakeDonateKPIs } from './StakeDonateKPIs'
import { StakingStepperItemComponentProps } from './StakingStepper'
import {
  StakingStepperItemBody,
  StakingStepperItemHeadline,
  StakingStepperItemOuterWrapper,
} from './StakingStepperItemSharedComponents'

export type StakingViewStakeDonateMode = 'stake' | 'donate'

export interface StakingViewStakeDonateProps extends StakingStepperItemComponentProps {}
export const StakingViewStakeDonate: FC<StakingViewStakeDonateProps> = () => {
  const { pathname } = useRouter()
  const [mode] = useState<StakingViewStakeDonateMode>(pathname === '/donate' ? 'donate' : 'stake')

  return (
    <>
      <StakingStepperItemOuterWrapper>
        <StakingStepperItemHeadline>
          {mode === 'donate' ? 'Donate' : 'Stake'}
        </StakingStepperItemHeadline>
        <StakingStepperItemBody>
          <StakeDonateBalance mode={mode} />
          <StakeDonateKPIs mode={mode} />
        </StakingStepperItemBody>
      </StakingStepperItemOuterWrapper>
    </>
  )
}
