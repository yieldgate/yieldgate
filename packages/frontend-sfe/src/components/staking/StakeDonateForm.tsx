import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { useDeployments } from '@lib/useDeployments'
import { constants } from 'ethers'
import { FC, SyntheticEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
  useWaitForTransaction,
} from 'wagmi'
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
  const { address } = useAccount()
  const { contracts, addresses, usedChainId } = useDeployments()

  // Check for earlier approval (allowance)
  const allowance = useContractRead({
    address: addresses?.USDC,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [
      address || constants.AddressZero,
      contracts?.TokenPool?.address || constants.AddressZero,
    ],
    enabled: !!address && addresses?.USDC && !!contracts?.TokenPool?.address,
    onError: (e) => {
      console.error(e)
      toast.error('Error while fetching allowance for USDC.')
    },
    onSuccess: (data) => {
      const allowanceIsMax = data?.eq(constants.MaxUint256)
      if (allowanceIsMax) setIsApproved(true)
    },
  })

  // Approval call
  const { config: approveConfig } = usePrepareContractWrite({
    address: addresses?.USDC,
    abi: erc20ABI,
    functionName: 'approve',
    chainId: usedChainId,
    args: [contracts?.TokenPool?.address || constants.AddressZero, constants.MaxUint256],
  })
  const approve = useContractWrite(approveConfig)
  const { isLoading: approveTsxIsLoading } = useWaitForTransaction({
    chainId: usedChainId,
    hash: approve?.data?.hash,
    onSuccess: () => {
      toast.success('Successfully approved USDC.')
      setIsApproved(true)
    },
    onError: (e) => {
      console.error(e)
      toast.error('Error while approving USDC. Try again…')
      setIsApproved(false)
    },
  })

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
                onClick={approve?.write as () => void}
                type="button"
                disabled={!isValid || isLoading || !approve?.write}
                isLoading={approveTsxIsLoading}
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
