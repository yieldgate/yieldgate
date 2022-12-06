import { ArrowTopRightOnSquareIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { truncateHash } from '@lib/truncateHash'
import { useDeployments } from '@lib/useDeployments'
import { formatUnits } from 'ethers/lib/utils'
import Image from 'next/image'
import usdcSvg from 'public/icons/tokens/usdc.svg'
import { FC } from 'react'
import { NumericFormat } from 'react-number-format'
import { SpinnerDiamond } from 'spinners-react'
import 'twin.macro'
import { theme } from 'twin.macro'
import { useAccount, useEnsName, useNetwork } from 'wagmi'
import { useStakeDonateAllowanceProviderContext } from './StakeDonateAllowanceProvider'
import { StakeDonateApprovalForm } from './StakeDonateApprovalForm'
import { StakingStepperItemComponentProps } from './StakingStepper'
import {
  StakingStepperItemContentBox,
  StakingStepperItemContentBoxDivider,
  StakingStepperItemContentBoxHeadline,
  StakingStepperItemContentBoxSubtitle,
} from './StakingStepperItemSharedComponents'

export interface StakeDonateAccountBalanceProps extends StakingStepperItemComponentProps {}
export const StakeDonateAccountBalance: FC<StakeDonateAccountBalanceProps> = ({ ...props }) => {
  const { address } = useAccount()
  const { addresses, usedChainId } = useDeployments()
  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const { chain } = useNetwork()
  const token = addresses?.USDC
  const {
    balance,
    balanceIsLoading,
    balanceIsError,
    isApproved,
    allowanceFormatted,
    allowanceIsMax,
  } = useStakeDonateAllowanceProviderContext()

  return (
    <>
      <StakingStepperItemContentBox>
        {/* Title section with address & chain */}
        <div tw="flex items-baseline justify-between">
          <StakingStepperItemContentBoxHeadline>
            Account Balance
          </StakingStepperItemContentBoxHeadline>
          <div tw="flex -translate-y-0.5 items-center space-x-2 rounded-full bg-gray-100 px-2.5 py-1.5">
            <div tw="h-2 w-2 rounded-full bg-green-500" />
            <div tw="text-xs leading-none">{chain?.name}</div>
          </div>
        </div>
        <StakingStepperItemContentBoxSubtitle title={address}>
          {ensName || truncateHash(address)}
        </StakingStepperItemContentBoxSubtitle>

        {/* Balance */}
        <StakingStepperItemContentBoxDivider />
        <div tw="flex items-center justify-between">
          <div tw="flex items-center space-x-4">
            {/* Currency Logo */}
            <Image src={usdcSvg} width={42} height={42} alt="USDC Token Logo" />

            {/* Balance Value */}
            {!balanceIsLoading && !!balance && (
              <div tw="flex flex-col">
                <NumericFormat
                  value={formatUnits(balance, 6)}
                  displayType={'text'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  thousandSeparator={true}
                  suffix=" USDC"
                  tw="-mt-0.5 whitespace-nowrap font-display font-bold text-2xl leading-none"
                />

                {/* Warning if balance too low */}
                {balance.isZero() && (
                  <div tw="-ml-px mt-0.5 font-semibold text-xs text-amber-500 leading-none">
                    Balance too low
                  </div>
                )}

                {/* Show approved amount */}
                {!balance.isZero() && (
                  <div tw="-ml-px mt-1 flex items-center text-xs text-gray-500 leading-none">
                    {isApproved
                      ? allowanceIsMax
                        ? 'Maximum approved'
                        : `${allowanceFormatted} USDC approved`
                      : 'Not approved'}
                  </div>
                )}
              </div>
            )}

            {/* Loading Indicator */}
            {balanceIsLoading && (
              <SpinnerDiamond
                size={24}
                thickness={125}
                color={theme('colors.gray.900')}
                secondaryColor={theme('colors.gray.400')}
              />
            )}
          </div>

          {/* Error */}
          {!balanceIsLoading && balanceIsError && (
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

        {/* Approval */}
        {(!balance?.isZero() || usedChainId === 80001) && (
          <>
            <StakingStepperItemContentBoxDivider />
            <StakeDonateApprovalForm {...props} />
          </>
        )}
      </StakingStepperItemContentBox>
    </>
  )
}
