import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { useDeployments } from '@lib/useDeployments'
import { TokenPool__factory } from '@yieldgate/contracts/typechain-types'
import { FC, SyntheticEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'
import { useSigner } from 'wagmi'
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
  const [isApproved, setIsApproved] = useState(false)
  const { data: signer } = useSigner()
  const { contracts, addresses } = useDeployments()

  // Approval Action
  const onApprove = async (e: SyntheticEvent) => {
    e?.preventDefault()
    if (!signer || !contracts || !addresses?.USDC) return
    setIsLoading(true)
    console.log({ contracts })
    const contract = TokenPool__factory.connect(contracts.TokenPool.address, signer)
    try {
      console.log('addresses.USDC', addresses.USDC)
      const tsx = await contract.approvePool(addresses.USDC)
      console.log({ tsx })
      const receipt = await tsx.wait()
      console.log({ receipt })
      toast.success('Successfully approved USDC.')
      setIsApproved(true)
    } catch (e) {
      toast.error('Error while approving USDC. Try again…')
      console.error(e)
      setIsApproved(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Staking Action
  const onStake = async (e: SyntheticEvent) => {
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

        <form>
          <StakeDonateAmountInputField form={form} {...props} />

          <StakeDonateImpactEstimationSlider form={form} {...props} />

          <StakingStepperItemContentBoxDivider />

          {/* Actions */}
          <BaseButtonGroup tw="grid grid-cols-1">
            {!isApproved && (
              <BaseButton
                onClick={onApprove}
                type="button"
                disabled={!isValid || isLoading}
                isLoading={isLoading}
              >
                Approve
              </BaseButton>
            )}
            {isApproved && (
              <BaseButton
                onClick={onStake}
                type="button"
                disabled={!isValid || isLoading}
                isLoading={isLoading}
              >
                {isDonateMode ? 'Donate' : 'Stake'}
              </BaseButton>
            )}
          </BaseButtonGroup>
        </form>
      </StakingStepperItemContentBox>
    </>
  )
}
