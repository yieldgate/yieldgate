import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { truncateHash } from '@lib/truncateHash'
import { constants } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import Image from 'next/image'
import usdcSvg from 'public/icons/tokens/usdc.svg'
import { FC } from 'react'
import { NumericFormat } from 'react-number-format'
import { SpinnerDiamond } from 'spinners-react'
import 'twin.macro'
import { theme } from 'twin.macro'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import {
  StakingStepperItemContentBox,
  StakingStepperItemContentBoxDivider,
  StakingStepperItemContentBoxHeadline,
  StakingStepperItemContentBoxSubtitle,
} from './StakingStepperItemSharedComponents'
import { StakingViewStakeDonateMode } from './StakingViewStakeDonate'

export interface StakeDonateBalanceProps {
  mode: StakingViewStakeDonateMode
}
export const StakeDonateBalance: FC<StakeDonateBalanceProps> = ({ mode }) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    watch: true,
    // TODO
    token:
      chain?.id === 137
        ? '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
        : chain?.id === 80001
        ? '0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2'
        : constants.AddressZero,
  })

  return (
    <>
      <StakingStepperItemContentBox>
        <StakingStepperItemContentBoxHeadline>Account Balance</StakingStepperItemContentBoxHeadline>
        <StakingStepperItemContentBoxSubtitle title={address}>
          {truncateHash(address)}
        </StakingStepperItemContentBoxSubtitle>
        <StakingStepperItemContentBoxDivider />
        <div tw="flex items-center space-x-4">
          <Image src={usdcSvg} width={40} height={40} alt="USDC Token Logo" />
          {!isLoading && data?.value && (
            <NumericFormat
              value={formatUnits(data.value, 6)}
              displayType={'text'}
              decimalScale={2}
              thousandSeparator={true}
              suffix=" USDC"
              tw="text-2xl leading-none font-display font-bold whitespace-nowrap"
            />
          )}
          {isLoading && (
            <SpinnerDiamond
              size={24}
              thickness={125}
              color={theme('colors.gray.900')}
              secondaryColor={theme('colors.gray.400')}
            />
          )}
          {!isLoading && isError && (
            <div tw="flex items-center text-amber-600">
              <ExclamationTriangleIcon tw="w-6 shrink-0 grow-0 mr-2" />
              <div tw="text-sm font-semibold mb-px">Error while fetching balance</div>
            </div>
          )}
        </div>
      </StakingStepperItemContentBox>
    </>
  )
}
