import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { useDeployments } from '@lib/useDeployments'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils.js'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'
import {
  useAccount,
  useContractWrite,
  useFeeData,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { useStakeDonateAllowanceProviderContext } from './StakeDonateAllowanceProvider'
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
  const form = useForm<StakeDonateFormValues>({ mode: 'onChange' })
  const { isValid } = form.formState
  const isDonateMode = props.mode === 'donate'
  const { address } = useAccount()
  const { contracts, addresses, usedChainId } = useDeployments()
  const stakingAmount = form.watch('stakingAmount')
  const { isApproved } = useStakeDonateAllowanceProviderContext()
  const { data: feeData } = useFeeData({ chainId: usedChainId })

  // Stake call
  const { config: stakeConfig } = usePrepareContractWrite({
    address: contracts?.TokenPoolWithApproval?.address,
    abi: contracts?.TokenPoolWithApproval?.abi,
    functionName: 'stake',
    chainId: usedChainId,
    args: [
      addresses?.USDC,
      address,
      isValid ? parseUnits(stakingAmount || '0', 6) : BigNumber.from(0),
    ],
    overrides: {
      gasLimit: 400000,
      maxFeePerGas: feeData?.maxFeePerGas,
      maxPriorityFeePerGas: feeData?.maxPriorityFeePerGas,
    },
  })
  const stake = useContractWrite(stakeConfig)
  const { isLoading: stakeIsLoading } = useWaitForTransaction({
    chainId: usedChainId,
    hash: stake?.data?.hash,
    onError: (e) => {
      console.error(e)
      toast.error('Error while staking USDC. Try again…')
    },
    onSuccess: () => {
      toast.success(`Successfully staked ${stakingAmount} USDC.`)
      props.onGoNext()
    },
  })

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

          {/* Estimation */}
          {!!parseFloat(stakingAmount) && (
            <>
              <StakingStepperItemContentBoxDivider />
              <StakeDonateImpactEstimationSlider form={form} {...props} />
            </>
          )}

          {/* Actions */}
          <StakingStepperItemContentBoxDivider />
          <BaseButtonGroup tw="grid grid-cols-1">
            {!isApproved && (
              <BaseButton type="button" onClick={props.onGoPrev}>
                Go back to approve USDC
              </BaseButton>
            )}
            {isApproved && (
              <BaseButton
                type="button"
                onClick={stake?.write as VoidFunction}
                disabled={!isValid || stakeIsLoading || !stake?.write}
                isLoading={stakeIsLoading}
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
