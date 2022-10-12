import { CenterBody } from '@components/layout/CenterBody'
import { FC } from 'react'
import 'twin.macro'
import { StakingStepperItemComponentProps } from './StakingHorizontalStepper'

export interface StakingViewStakeDonateProps extends StakingStepperItemComponentProps {}
export const StakingViewStakeDonate: FC<StakingViewStakeDonateProps> = () => {
  return (
    <>
      <CenterBody>StakingViewStakeDonate</CenterBody>
    </>
  )
}
