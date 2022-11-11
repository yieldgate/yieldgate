import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { USDC_DECIMALS } from '@deployments/addresses'
import { useDeployments } from '@lib/useDeployments'
import { constants } from 'ethers'
import { parseUnits } from 'ethers/lib/utils.js'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
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
  const form = useForm<StakeDonateFormValues>({ mode: 'onChange' })
  const { isValid } = form.formState
  const isDonateMode = props.mode === 'donate'
  const [isApproved, setIsApproved] = useState(false)
  const { address } = useAccount()
  const { contracts, addresses, usedChainId } = useDeployments()
  const stakingAmount = form.watch('stakingAmount')

  // Check for earlier approval (allowance)
  useContractRead({
    address: addresses?.USDC,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [
      address || constants.AddressZero,
      contracts?.TokenPool?.address || constants.AddressZero,
    ],
    enabled: !!address && !!addresses?.USDC && !!contracts?.TokenPool?.address,
    onError: (e) => {
      console.error(e)
      toast.error('Error while fetching allowance for USDC.')
      setIsApproved(false)
    },
    onSuccess: (data) => {
      const allowanceIsMax = data?.eq(constants.MaxUint256)
      setIsApproved(allowanceIsMax)
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

  // Staking call
  const { config: stakeConfig } = usePrepareContractWrite({
    address: contracts?.TokenPool?.address,
    abi: contracts?.TokenPool?.abi,
    functionName: 'stake',
    chainId: usedChainId,
    overrides: {
      gasLimit: 1000000,
    },
    args: [addresses?.USDC, address, parseUnits(stakingAmount || '0', USDC_DECIMALS)],
  })
  const stake = useContractWrite(stakeConfig)
  const { isLoading: stakeTsxIsLoading } = useWaitForTransaction({
    chainId: usedChainId,
    hash: stake?.data?.hash,
    onSuccess: () => {
      toast.success(`Successfully staked ${stakingAmount} USDC.`)
      props.onGoNext()
    },
    onError: (e) => {
      console.error(e)
      toast.error('Error while staking USDC. Try again…')
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

          <StakeDonateImpactEstimationSlider form={form} {...props} />

          <StakingStepperItemContentBoxDivider />

          {/* Actions */}
          <BaseButtonGroup tw="grid grid-cols-1">
            {!isApproved && (
              <BaseButton
                onClick={approve?.write as () => void}
                type="button"
                disabled={!isValid || approveTsxIsLoading || !approve?.write}
                isLoading={approveTsxIsLoading}
              >
                Approve
              </BaseButton>
            )}
            {isApproved && (
              <BaseButton
                onClick={stake?.write as () => void}
                type="button"
                disabled={!isValid || stakeTsxIsLoading || !stake?.write}
                isLoading={stakeTsxIsLoading}
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
