import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { USDC_DECIMALS } from '@deployments/addresses'
import { useDeployments } from '@lib/useDeployments'
import { BigNumber, constants } from 'ethers'
import { formatUnits } from 'ethers/lib/utils.js'
import { FC, PropsWithChildren, useState } from 'react'
import toast from 'react-hot-toast'
import { NumericFormat } from 'react-number-format'
import { SpinnerDiamond } from 'spinners-react'
import 'twin.macro'
import { theme } from 'twin.macro'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import {
  StakingStepperItemContentBox,
  StakingStepperItemContentBoxDivider,
  StakingStepperItemContentBoxHeadline,
} from './StakingStepperItemSharedComponents'
import { StakingViewStakeDonateProps } from './StakingViewStakeDonate'

export interface StakeDonateKPIsProps extends StakingViewStakeDonateProps {}
export const StakeDonateKPIs: FC<StakeDonateKPIsProps> = ({ mode }) => {
  const { contracts, addresses, usedChainId } = useDeployments()
  const { address } = useAccount()

  // Fetch existing stake
  const [stakeAmount, setStakeAmount] = useState<number>()
  const { isLoading: stakeAmountIsLoading, refetch: refetchStakeAmount } = useContractRead({
    address: contracts?.TokenPool.address,
    abi: contracts?.TokenPool.abi,
    chainId: usedChainId,
    functionName: 'stakes',
    args: [addresses?.USDC || constants.AddressZero, address || constants.AddressZero],
    enabled: !!address && !!addresses?.USDC && !!contracts?.TokenPool?.address,
    onError: (e) => {
      console.error(e)
      toast.error('Error while fetching existing stake.')
      setStakeAmount(undefined)
    },
    onSuccess: (data) => {
      const stakeAmount = BigNumber.isBigNumber(data)
        ? parseFloat(formatUnits(data, USDC_DECIMALS))
        : undefined
      setStakeAmount(stakeAmount)
    },
  })

  // Unstake call
  const { config: unstakeConfig } = usePrepareContractWrite({
    address: contracts?.TokenPool?.address,
    abi: contracts?.TokenPool?.abi,
    chainId: usedChainId,
    functionName: 'unstake',
    overrides: {
      gasLimit: 1000000,
    },
    args: [addresses?.USDC],
  })
  const unstake = useContractWrite(unstakeConfig)
  const { isLoading: unstakeIsLoading } = useWaitForTransaction({
    chainId: usedChainId,
    hash: unstake?.data?.hash,
    onError: (e) => {
      console.error(e)
      toast.error('Error while unstaking USDC. Try again…')
      refetchStakeAmount?.()
    },
    onSuccess: () => {
      toast.success(`Successfully unstaked ${stakeAmount} USDC.`)
      refetchStakeAmount?.()
    },
  })

  if (!stakeAmount) return null

  return (
    <>
      <StakingStepperItemContentBox>
        <StakingStepperItemContentBoxHeadline>
          {mode === 'donate' ? 'Your previous Donations' : 'Your current Staking'}
        </StakingStepperItemContentBoxHeadline>

        {/* KPIs */}
        <div tw="-m-1 grid grid-cols-2 sm:grid-cols-3">
          <StakeDonateKPI title="Impact (CO₂)" tw="col-span-2 text-green-500 sm:col-span-1">
            <NumericFormat
              value={0}
              displayType={'text'}
              decimalScale={0}
              fixedDecimalScale={true}
              thousandSeparator={true}
              suffix=" kg"
            />
          </StakeDonateKPI>
          <StakeDonateKPI title="Stake (USDC)" isLoading={stakeAmountIsLoading}>
            <NumericFormat
              value={stakeAmount}
              displayType={'text'}
              decimalScale={2}
              fixedDecimalScale={true}
              thousandSeparator={true}
            />
          </StakeDonateKPI>
          <StakeDonateKPI title="Duration">0 days</StakeDonateKPI>
        </div>

        <StakingStepperItemContentBoxDivider />

        {/* Actions */}
        <BaseButtonGroup tw="grid grid-cols-2">
          <BaseButton asLink={true} href="https://doingud.com/" target="_blank">
            View Badge ↗
          </BaseButton>
          <BaseButton
            variant="outline"
            onClick={unstake?.write as VoidFunction}
            type="button"
            disabled={unstakeIsLoading || !unstake?.write || !stakeAmount}
            isLoading={unstakeIsLoading}
          >
            Withdraw
          </BaseButton>
        </BaseButtonGroup>
      </StakingStepperItemContentBox>
    </>
  )
}

export interface StakeDonateKPIProps {
  title: string
  isLoading?: boolean
}
export const StakeDonateKPI: FC<PropsWithChildren<StakeDonateKPIProps>> = ({
  title,
  children: value,
  isLoading,
  ...props
}) => {
  return (
    <>
      <div tw="m-1 flex flex-col space-y-1 rounded bg-gray-100 py-3 px-4" {...props}>
        <h4 tw="text-sm text-gray-500!">{title}</h4>
        {!isLoading && <p tw="font-bold text-xl tracking-tight">{value}</p>}
        {isLoading && (
          <SpinnerDiamond
            size={20}
            thickness={125}
            color={theme('colors.gray.900')}
            secondaryColor={theme('colors.gray.400')}
            tw="py-1"
          />
        )}
      </div>
    </>
  )
}
