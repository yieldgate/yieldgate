import { USDC_DECIMALS } from '@deployments/addresses'
import { CircleStackIcon } from '@heroicons/react/20/solid'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import Image from 'next/image'
import usdcSvg from 'public/icons/tokens/usdc.svg'
import { FC } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import 'twin.macro'
import tw from 'twin.macro'
import { useStakeDonateAllowanceProviderContext } from './StakeDonateAllowanceProvider'
import { StakeDonateFormValues } from './StakeDonateForm'
import { StakingStepperItemContentBoxSecondaryAction } from './StakingStepperItemSharedComponents'
import { StakingViewStakeDonateProps } from './StakingViewStakeDonate'

export interface StakeDonateAmountInputFieldProps extends StakingViewStakeDonateProps {
  form: UseFormReturn<StakeDonateFormValues, any>
}
export const StakeDonateAmountInputField: FC<StakeDonateAmountInputFieldProps> = ({
  form,
  onGoPrev,
}) => {
  const { errors } = form.formState
  const { balance, allowance, allowanceIsMax, isApproved } =
    useStakeDonateAllowanceProviderContext()

  return (
    <>
      {/* Input Field */}
      <div tw="relative">
        <label htmlFor="stakingAmount" tw="sr-only">
          Staking Amount
        </label>
        <input
          type="text"
          id="stakingAmount"
          placeholder="100.00"
          tw="w-full rounded border border-gray-300 bg-white py-5 pl-4 font-medium text-2xl text-black leading-none outline-none pr-[5rem] focus:(ring-2 ring-sky-500 ring-offset-2)"
          {...form.register('stakingAmount', {
            required: true,
            min: {
              value: 1,
              message: 'Please enter an amount ≥ 1.',
            },
            pattern: {
              value: /^(0|[1-9]\d*)(\.\d+)?$/,
              message: 'Please enter a valid number.',
            },
            validate: {
              approval: (val) => {
                if (!val || allowanceIsMax || !allowance) return
                if (BigNumber.from(parseUnits(val, USDC_DECIMALS)).lte(allowance)) return
                return 'Entered amount is higher than approval.'
              },
              balance: (val) => {
                if (!val || !balance) return
                if (BigNumber.from(parseUnits(val, USDC_DECIMALS)).lte(balance)) return
                return 'Entered amount is higher than balance.'
              },
            },
          })}
        />

        <div tw="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col items-end space-y-2">
          {/* Unit (USDC) */}
          <div tw="flex items-center space-x-1 font-medium text-lg text-black leading-none tracking-tight">
            <Image src={usdcSvg} width={18} height={18} alt="USDC Token Logo" />
            <div>USDC</div>
          </div>

          {/* Balance and "Max"-Button */}
          {!!balance && (
            <div tw="flex items-baseline justify-end space-x-1.5 text-xs leading-none">
              <div
                tw="font-medium text-gray-500"
                css={[balance.isZero() && tw`font-bold text-amber-500`]}
              >
                Balance:{' '}
                <NumericFormat
                  value={formatUnits(balance, USDC_DECIMALS)}
                  displayType={'text'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  thousandSeparator={true}
                />
              </div>
              {!balance.isZero() && (
                <button
                  type="button"
                  tw="rounded-md border border-green-200 py-0.5 px-1 font-semibold text-green-500 uppercase tracking-wide hover:border-green-300"
                  onClick={() => {
                    form.setValue(
                      'stakingAmount',
                      parseFloat(formatUnits(balance, USDC_DECIMALS)).toFixed(2)
                    )
                  }}
                >
                  Max
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div tw="my-4 flex flex-col flex-wrap items-center justify-center space-y-3 whitespace-nowrap text-xs sm:(flex-row items-baseline space-y-0 space-x-2)">
        {/* Error Message */}
        {!!errors.stakingAmount?.message && (
          <div tw="grow font-bold text-amber-500">{errors.stakingAmount?.message}</div>
        )}

        {/* Top-up button */}
        <StakingStepperItemContentBoxSecondaryAction type="button" onClick={onGoPrev}>
          Prepare funds
          <CircleStackIcon />
        </StakingStepperItemContentBoxSecondaryAction>
      </div>
    </>
  )
}
