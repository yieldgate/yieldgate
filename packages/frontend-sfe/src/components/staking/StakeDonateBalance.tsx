import { ArrowTopRightOnSquareIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
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
import { useAccount, useBalance, useEnsName, useNetwork } from 'wagmi'
import { StakingStepperItemComponentProps } from './StakingStepper'
import {
  StakingStepperItemContentBox,
  StakingStepperItemContentBoxDivider,
  StakingStepperItemContentBoxHeadline,
  StakingStepperItemContentBoxSubtitle,
} from './StakingStepperItemSharedComponents'

export interface StakeDonateBalanceProps extends StakingStepperItemComponentProps {}
export const StakeDonateBalance: FC<StakeDonateBalanceProps> = () => {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const { chain } = useNetwork()
  // TODO
  const token =
    chain?.id === 137
      ? '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
      : chain?.id === 80001
      ? '0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2'
      : constants.AddressZero
  const {
    data: balance,
    isError,
    isLoading,
  } = useBalance({
    addressOrName: address,
    watch: true,
    token,
  })

  return (
    <>
      <StakingStepperItemContentBox>
        <div tw="flex items-baseline justify-between">
          <StakingStepperItemContentBoxHeadline>
            Account Balance
          </StakingStepperItemContentBoxHeadline>
          {/* Chain Name */}
          <div tw="flex -translate-y-0.5 items-center space-x-2 rounded-full bg-gray-100 px-2.5 py-1.5">
            <div tw="h-2 w-2 rounded-full bg-green-500" />
            <div tw="text-xs leading-none">{chain?.name}</div>
          </div>
        </div>
        <StakingStepperItemContentBoxSubtitle title={address}>
          {ensName || truncateHash(address)}
        </StakingStepperItemContentBoxSubtitle>

        <StakingStepperItemContentBoxDivider />

        <div tw="flex items-center justify-between">
          <div tw="flex items-center space-x-4">
            {/* Currency Logo */}
            <Image src={usdcSvg} width={40} height={40} alt="USDC Token Logo" />

            {/* Balance Value */}
            {!isLoading && balance?.value && (
              <div tw="flex flex-col">
                <NumericFormat
                  value={formatUnits(balance.value, 6)}
                  displayType={'text'}
                  decimalScale={2}
                  thousandSeparator={true}
                  suffix=" USDC"
                  tw="whitespace-nowrap font-display font-bold text-2xl leading-none"
                />

                {/* Warning if balance too low */}
                {balance.value.isZero() && (
                  <div tw="-ml-px mt-0.5 font-semibold text-xs text-amber-500 leading-none">
                    Balance too low
                  </div>
                )}
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <SpinnerDiamond
                size={24}
                thickness={125}
                color={theme('colors.gray.900')}
                secondaryColor={theme('colors.gray.400')}
              />
            )}
          </div>

          {/* Error */}
          {!isLoading && isError && (
            <div tw="flex items-center text-amber-600">
              <ExclamationTriangleIcon tw="mr-2 w-6 shrink-0 grow-0" />
              <div tw="mb-px font-semibold text-sm">Error while fetching balance</div>
            </div>
          )}

          {/* Explorer URL of token contract */}
          {!!chain?.blockExplorers?.['etherscan'] && !!token && (
            <a
              href={`${chain.blockExplorers['etherscan'].url}/address/${token}`}
              target="_blank"
              title={chain.blockExplorers['etherscan'].name}
              tw="shrink-0 grow-0 text-gray-400 hover:text-gray-800"
            >
              <ArrowTopRightOnSquareIcon tw="h-5 w-5" />
            </a>
          )}
        </div>
      </StakingStepperItemContentBox>
    </>
  )
}
