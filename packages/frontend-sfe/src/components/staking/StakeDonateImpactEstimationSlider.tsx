import { FC, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import ReactSlider from 'react-slider'
import 'twin.macro'
import tw, { styled } from 'twin.macro'
import { StakeDonateFormValues } from './StakeDonateForm'
import {
  StakingStepperItemContentBoxHeadline,
  StakingStepperItemContentBoxSubtitle,
} from './StakingStepperItemSharedComponents'
import { StakingViewStakeDonateProps } from './StakingViewStakeDonate'

const StyledSlider = tw(
  ReactSlider
)`cursor-ew-resize rounded-full bg-green-500 pr-[1.5rem] h-[1.5rem]`
const StyledSliderThumb = tw.div`rounded-full border-2 border-green-500 bg-white w-[1.5rem] h-[1.5rem] focus:(border-sky-500 ring-2 ring-sky-500)`
const StyledTrack = styled.div(({ index }: any) => [
  tw`top-0 bottom-0 rounded-full`,
  index == 1 && tw`bg-gray-200`,
])

// Source: https://www.tutorialspoint.com/calculate-compound-interest-in-javascript
const compoundInterest = (principal: number, time: number, rate: number, n: number) => {
  const amount = principal * Math.pow(1 + rate / n, n * time)
  const interest = amount - principal
  return interest
}

export interface StakeDonateImpactEstimationSliderProps extends StakingViewStakeDonateProps {
  form: UseFormReturn<StakeDonateFormValues, any>
}
export const StakeDonateImpactEstimationSlider: FC<StakeDonateImpactEstimationSliderProps> = ({
  form,
}) => {
  const [minMonths, maxMonths, stepMonths] = [3, 60, 1]
  const [durationMonths, setDurationMonths] = useState(12)
  const [durationFormatted, setDurationFormatted] = useState<string>()
  const [estimatedInterest, setEstimatedInterest] = useState<number>()
  const [estimatedCarbonFormatted, setEstimatedCarbonFormatted] = useState<string>()
  const stakingAmount = parseFloat(form.watch('stakingAmount'))
  const apy = 0.03
  const nctRate = 0.5417

  useEffect(() => {
    // Determine `durationFormatted`
    const years = Math.floor(durationMonths / 12)
    const remainingMonths = Math.round(durationMonths % 12)
    const yearsFormatted = `${years} year${years > 1 ? 's' : ''}`
    const remainingMonthsFormatted = `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
    const durationFormatted = `${years ? yearsFormatted : ''}${
      years && remainingMonths ? ' and ' : ''
    }${remainingMonths ? remainingMonthsFormatted : ''}`
    setDurationFormatted(durationFormatted)

    // Determine `estimatedCarbonFormatted`
    const estimatedInterest = compoundInterest(stakingAmount, durationMonths / 12, apy, 12)
    setEstimatedInterest(estimatedInterest)
    const estimatedCarbonTonnes = estimatedInterest * nctRate
    const estimatedCarbonFormatted =
      estimatedCarbonTonnes > 1
        ? `${estimatedCarbonTonnes.toFixed(2)} t`
        : `${(estimatedCarbonTonnes * 1000).toFixed(0)} kg`
    setEstimatedCarbonFormatted(estimatedCarbonFormatted)
  }, [durationMonths, stakingAmount])

  if (!stakingAmount) return null

  return (
    <>
      <StakingStepperItemContentBoxHeadline tw="mt-4">
        Estimated Impact
      </StakingStepperItemContentBoxHeadline>
      <StakingStepperItemContentBoxSubtitle>
        See the estimated climate impact for the selected duration.
      </StakingStepperItemContentBoxSubtitle>

      {/* Slider */}
      <StyledSlider
        defaultValue={durationMonths}
        onChange={(val) => {
          setDurationMonths(val)
        }}
        min={minMonths}
        max={maxMonths}
        step={stepMonths}
        renderThumb={(props, state) => <StyledSliderThumb {...props} />}
        renderTrack={(props, state) => <StyledTrack {...props} index={state.index} />}
      />

      {/* Legend */}
      <div tw="mt-2 flex justify-between text-xs text-gray-600">
        <div>{minMonths} months</div>
        <div>{maxMonths / 12} years</div>
      </div>

      {/* Estimation */}
      <div tw="mt-4 rounded-lg bg-primary-50 py-2 px-3 text-sm">
        The estimated amount of carbon offsetted after staking{' '}
        <strong tw="whitespace-nowrap">{stakingAmount} USDC</strong> for{' '}
        <strong>{durationFormatted}</strong> at {apy * 100} % APY is{' '}
        <strong tw="whitespace-nowrap">{estimatedCarbonFormatted}</strong>.
      </div>
    </>
  )
}
