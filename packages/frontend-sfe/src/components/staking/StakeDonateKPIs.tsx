import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { USDC_DECIMALS } from '@deployments/addresses'
import { useDeployments } from '@lib/useDeployments'
import { TokenPool__factory } from '@yieldgate/contracts/typechain-types'
import { formatUnits } from 'ethers/lib/utils.js'
import { FC, PropsWithChildren, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { SpinnerDiamond } from 'spinners-react'
import 'twin.macro'
import { theme } from 'twin.macro'
import useAsyncEffect from 'use-async-effect'
import { useAccount, useProvider } from 'wagmi'
import {
  StakingStepperItemContentBox,
  StakingStepperItemContentBoxDivider,
  StakingStepperItemContentBoxHeadline,
} from './StakingStepperItemSharedComponents'
import { StakingViewStakeDonateProps } from './StakingViewStakeDonate'

export interface StakeDonateKPIsProps extends StakingViewStakeDonateProps {}
export const StakeDonateKPIs: FC<StakeDonateKPIsProps> = ({ mode }) => {
  const { contracts, addresses } = useDeployments()
  const provider = useProvider()
  const { address } = useAccount()

  // Fetch existing stake
  const [stakeAmountIsLoading, setStakeAmountIsLoading] = useState(true)
  const [stakeAmount, setStakeAmount] = useState<number>()
  useAsyncEffect(async () => {
    const tokenPoolAddress = contracts?.TokenPool?.address
    const tokenAddress = addresses?.USDC
    if (!tokenPoolAddress || !tokenAddress || !address) return
    setStakeAmountIsLoading(true)
    try {
      const contract = TokenPool__factory.connect(tokenPoolAddress, provider)
      const result = await contract.stakes(tokenAddress, address)
      const stakeAmount = parseFloat(formatUnits(result, USDC_DECIMALS))
      setStakeAmount(stakeAmount)
    } finally {
      setStakeAmountIsLoading(false)
    }
  }, [address, contracts])

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
          <BaseButton variant="outline">Withdraw</BaseButton>
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
