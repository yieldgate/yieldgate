import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { FC, SyntheticEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import 'twin.macro'
import { StakeDonateAmountInputField } from './StakeDonateAmountInputField'
import { StakeDonateImpactEstimationSlider } from './StakeDonateImpactEstimationSlider'
import {
  StakingStepperItemContentBox,
  StakingStepperItemContentBoxDivider,
  StakingStepperItemContentBoxHeadline,
  StakingStepperItemContentBoxSubtitle,
} from './StakingStepperItemSharedComponents'
import { StakingViewStakeDonateProps } from './StakingViewStakeDonate'

export type StakeDonateFormValues = {
  stakingAmount: string
}

export interface StakeDonateFormProps extends StakingViewStakeDonateProps {}
export const StakeDonateForm: FC<StakeDonateFormProps> = ({ ...props }) => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<StakeDonateFormValues>({ mode: 'onChange' })
  const { isValid } = form.formState
  const isDonateMode = props.mode === 'donate'

  // Handle form submit (staking action)
  const onSubmit = async (e: SyntheticEvent) => {
    e?.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    props.onGoNext()
  }

  return (
    <>
      <StakingStepperItemContentBox>
        <StakingStepperItemContentBoxHeadline>
          {isDonateMode ? 'Donation Amount' : 'Staking Amount'}
        </StakingStepperItemContentBoxHeadline>
        <StakingStepperItemContentBoxSubtitle>
          Set the amount you want to put into the climate pool to participate in carbon credits
          burning.{' '}
          {isDonateMode ? (
            <strong>Your donation will be permanent and you can&apos;t revoke your funds.</strong>
          ) : (
            <strong>You can always unstake.</strong>
          )}
        </StakingStepperItemContentBoxSubtitle>

        <form onSubmit={onSubmit}>
          <StakeDonateAmountInputField form={form} {...props} />

          <StakeDonateImpactEstimationSlider form={form} {...props} />

          <StakingStepperItemContentBoxDivider />

          {/* Actions */}
          <BaseButtonGroup tw="grid grid-cols-1">
            <BaseButton
              onClick={onSubmit}
              type="submit"
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              {isDonateMode ? 'Donate' : 'Stake'}
            </BaseButton>
          </BaseButtonGroup>
        </form>
      </StakingStepperItemContentBox>
    </>
  )
}
