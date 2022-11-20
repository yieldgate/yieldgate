import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { USDC_DECIMALS } from '@deployments/addresses'
import { AdjustmentsHorizontalIcon, PlusCircleIcon } from '@heroicons/react/20/solid'
import { useDeployments } from '@lib/useDeployments'
import { constants } from 'ethers'
import { parseUnits } from 'ethers/lib/utils.js'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'
import tw from 'twin.macro'
import { erc20ABI, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useStakeDonateAllowanceProviderContext } from './StakeDonateAllowanceProvider'
import { StakingStepperItemComponentProps } from './StakingStepper'
import { StakingStepperItemContentBoxSecondaryAction } from './StakingStepperItemSharedComponents'

export interface StakeDonateApprovalFormProps extends StakingStepperItemComponentProps {}
export const StakeDonateApprovalForm: FC<StakeDonateApprovalFormProps> = ({ onGoNext }) => {
  const { contracts, addresses, usedChainId } = useDeployments()
  const [showAmountInput, setShowAmountInput] = useState(false)
  const form = useForm<{ approvalAmount: string }>({ mode: 'onChange' })
  const { isValid } = form.formState
  const approvalAmount = form.watch('approvalAmount')
  const { isApproved, allowanceIsMax } = useStakeDonateAllowanceProviderContext()

  // Approval call
  const { config: approveConfig } = usePrepareContractWrite({
    address: addresses?.USDC,
    abi: erc20ABI,
    functionName: 'approve',
    chainId: usedChainId,
    args: [
      contracts?.TokenPool?.address || constants.AddressZero,
      showAmountInput && isValid && approvalAmount
        ? parseUnits(approvalAmount, USDC_DECIMALS)
        : constants.MaxUint256,
    ],
  })
  const approve = useContractWrite(approveConfig)
  const { isLoading: approveIsLoading } = useWaitForTransaction({
    chainId: usedChainId,
    hash: approve?.data?.hash,
    onError: (e) => {
      console.error(e)
      toast.error('Error while approving USDC. Try again…')
    },
    onSuccess: () => {
      if (showAmountInput && parseFloat(approvalAmount) === 0) {
        toast.success('Successfully revoked USDC approval.')
      } else {
        toast.success('Successfully approved USDC.')
        onGoNext()
      }
    },
  })

  return (
    <>
      <BaseButtonGroup tw="grid grid-cols-2 sm:grid-cols-2">
        {/* Approval specific amount form */}
        {showAmountInput && (
          <>
            <input
              type="text"
              placeholder="100.00"
              disabled={approveIsLoading}
              tw="rounded border border-gray-300 bg-white py-2 pl-3 font-medium text-black leading-none outline-none focus:(ring-2 ring-sky-500 ring-offset-2)"
              {...form.register('approvalAmount', {
                required: true,
                min: {
                  value: 0,
                  message: 'Please enter an amount ≥ 0',
                },
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/,
                  message: 'Please enter a valid number',
                },
              })}
            ></input>
            <BaseButton
              type="button"
              variant={isApproved && allowanceIsMax ? 'outline' : 'solid'}
              onClick={approve?.write as VoidFunction}
              disabled={
                approveIsLoading ||
                !approve?.write ||
                !isValid ||
                (parseFloat(approvalAmount) === 0 && !isApproved)
              }
              isLoading={approveIsLoading}
            >
              {isValid && parseFloat(approvalAmount) === 0
                ? 'Revoke Approval'
                : isApproved
                ? 'Update Approval'
                : 'Set Approval'}
            </BaseButton>
          </>
        )}

        {/* Set maximum approval button */}
        {!showAmountInput && (!isApproved || !allowanceIsMax) && (
          <BaseButton
            type="button"
            tw="col-span-2"
            onClick={approve?.write as VoidFunction}
            disabled={approveIsLoading || !approve?.write || (isApproved && allowanceIsMax)}
            isLoading={approveIsLoading}
          >
            {isApproved
              ? allowanceIsMax
                ? 'All USDC are approved'
                : 'Approve all USDC'
              : 'Approve all USDC'}
          </BaseButton>
        )}
      </BaseButtonGroup>

      {/* Approval amount input field toggle */}
      {(!showAmountInput || !isApproved || !allowanceIsMax) && (
        <div tw="mt-2.5 flex justify-center" css={[isApproved && allowanceIsMax && tw`mt-2`]}>
          <StakingStepperItemContentBoxSecondaryAction
            type="button"
            disabled={approveIsLoading}
            onClick={() => {
              setShowAmountInput(!showAmountInput)
            }}
          >
            {showAmountInput ? (
              <>
                Set to maximum approval
                <PlusCircleIcon />
              </>
            ) : isApproved && allowanceIsMax ? (
              <>
                Update approval
                <AdjustmentsHorizontalIcon />
              </>
            ) : (
              <>
                Edit approval amount
                <AdjustmentsHorizontalIcon />
              </>
            )}
          </StakingStepperItemContentBoxSecondaryAction>
        </div>
      )}
    </>
  )
}
