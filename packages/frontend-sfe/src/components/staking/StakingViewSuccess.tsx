import { CenterBody } from '@components/layout/CenterBody'
import { FC } from 'react'
import 'twin.macro'
import { StakingStepperItemComponentProps } from './StakingStepper'

export interface StakingViewSuccessProps extends StakingStepperItemComponentProps {}
export const StakingViewSuccess: FC<StakingViewSuccessProps> = () => {
  return (
    <>
      <CenterBody>Success</CenterBody>
    </>
  )
}
