import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { CircleStackIcon } from '@heroicons/react/20/solid'
import { useDeployments } from '@lib/useDeployments'
import { formatUnits } from 'ethers/lib/utils'
import Image from 'next/image'
import usdcSvg from 'public/icons/tokens/usdc.svg'
import { FC, SyntheticEvent, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import 'twin.macro'
import { useAccount, useBalance, useNetwork } from 'wagmi'
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

  // Handle form submit (staking action)
  const onSubmit = async (e: SyntheticEvent) => {
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

        <form onSubmit={onSubmit}>
          <StakeDonateAmountInputField form={form} {...props} />

          <StakeDonateImpactEstimationSlider form={form} {...props} />

          <StakingStepperItemContentBoxDivider />

          {/* Actions */}
          <BaseButtonGroup tw="grid grid-cols-1">
            <BaseButton
              onClick={onSubmit}
              type="submit"
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              {isDonateMode ? 'Donate' : 'Stake'}
            </BaseButton>
          </BaseButtonGroup>
        </form>
      </StakingStepperItemContentBox>
    </>
  )
}

export interface StakeDonateAmountInputFieldProps extends StakingViewStakeDonateProps {
  form: UseFormReturn<StakeDonateFormValues, any>
}
export const StakeDonateAmountInputField: FC<StakeDonateAmountInputFieldProps> = ({
  form,
  onGoPrev,
}) => {
  const { errors } = form.formState
  const { address } = useAccount()
  const { addresses } = useDeployments()
  const { chain } = useNetwork()
  const token = addresses?.USDC
  const { data: balance } = useBalance({
    addressOrName: address,
    watch: true,
    token,
  })

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
              message: 'Please enter an amount ≥ 1',
            },
            pattern: {
              value: /^(0|[1-9]\d*)(\.\d+)?$/,
              message: 'Please enter a valid number',
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
          {balance !== undefined && (
            <div tw="flex h-4 items-baseline justify-end space-x-1.5 text-sm leading-none">
              <div tw="text-gray-600">
                Balance:{' '}
                <NumericFormat
                  value={formatUnits(balance.value, 18 /* TODO USDCs has 6 decimals */)}
                  displayType={'text'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  thousandSeparator={true}
                />
              </div>
              <button
                type="button"
                tw="rounded-md border border-green-200 py-0.5 px-1 font-semibold text-green-500 hover:border-green-300"
                onClick={() => {
                  form.setValue('stakingAmount', parseFloat(balance.formatted).toFixed(2))
                }}
              >
                Max
              </button>
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
        <button
          tw="flex items-center justify-center font-medium text-gray-800 hover:text-black"
          onClick={onGoPrev}
          type="button"
        >
          Top-up or bridge funds
          <CircleStackIcon tw="ml-1.5 h-3.5 w-3.5" />
        </button>
      </div>
    </>
  )
}
