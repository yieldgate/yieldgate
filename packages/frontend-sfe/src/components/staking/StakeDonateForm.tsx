import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { constants } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import Image from 'next/image'
import usdcSvg from 'public/icons/tokens/usdc.svg'
import { FC, SyntheticEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import 'twin.macro'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import {
  StakingStepperItemContentBox,
  StakingStepperItemContentBoxDivider,
  StakingStepperItemContentBoxHeadline,
  StakingStepperItemContentBoxSubtitle,
} from './StakingStepperItemSharedComponents'
import { StakingViewStakeDonateProps } from './StakingViewStakeDonate'

export interface StakeDonateFormProps extends StakingViewStakeDonateProps {}
export const StakeDonateForm: FC<StakeDonateFormProps> = ({ mode, onGoNext }) => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({ mode: 'onChange' })
  const { isValid } = form.formState

  // Fetch USDC balance
  const { address } = useAccount()
  const { chain } = useNetwork()
  const {
    data: balance,
    isError,
    isLoading: balanceIsLoading,
  } = useBalance({
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

  // Handle form submit (staking action)
  const onSubmit = async (e: SyntheticEvent) => {
    e?.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    onGoNext()
  }

  return (
    <>
      <StakingStepperItemContentBox>
        <StakingStepperItemContentBoxHeadline>
          {mode === 'donate' ? 'Donation Amount' : 'Staking Amount'}
        </StakingStepperItemContentBoxHeadline>
        <StakingStepperItemContentBoxSubtitle>
          Explanation Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
          doloremque laudantium, totam rem.
        </StakingStepperItemContentBoxSubtitle>

        <form onSubmit={onSubmit}>
          <label htmlFor="stakingAmount" tw="sr-only">
            Staking Amount
          </label>
          <div tw="relative">
            {/* Stake Amount Input */}
            <input
              type="text"
              id="stakingAmount"
              placeholder="100.00"
              tw="w-full bg-white text-2xl font-medium text-black border border-gray-300 rounded leading-none py-5 pl-4 pr-[5rem] outline-none focus:(ring-offset-2 ring-2 ring-sky-500)"
              {...form.register('stakingAmount', {
                required: true,
                min: 1,
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/,
                  message: 'Please enter a valid number',
                },
              })}
            />

            {/* Unit & Balance Input Suffix */}
            <div tw="flex flex-col items-end space-y-1.5 absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <div tw="flex items-center space-x-1 text-lg font-medium text-black tracking-tight leading-none">
                <Image src={usdcSvg} width={20} height={20} alt="USDC Token Logo" />
                <div>USDC</div>
              </div>
              <div tw="flex justify-end items-baseline text-sm leading-none h-4 space-x-1.5">
                {balance !== undefined && (
                  <>
                    <div tw="text-gray-600">
                      Balance:{' '}
                      <NumericFormat
                        value={formatUnits(balance.value, 6)}
                        displayType={'text'}
                        decimalScale={2}
                        thousandSeparator={true}
                      />
                    </div>
                    <button
                      type="button"
                      tw="text-green-500 font-semibold border border-green-200 hover:(border-green-400) rounded p-0.5"
                      onClick={() => {
                        form.setValue('stakingAmount', balance.formatted)
                      }}
                    >
                      Max
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <StakingStepperItemContentBoxDivider />

          {/* Actions */}
          <BaseButtonGroup tw="grid grid-cols-1">
            <BaseButton
              onClick={onSubmit}
              type="submit"
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              {mode === 'donate' ? 'Donate' : 'Stake'}
            </BaseButton>
          </BaseButtonGroup>
        </form>
      </StakingStepperItemContentBox>
    </>
  )
}
