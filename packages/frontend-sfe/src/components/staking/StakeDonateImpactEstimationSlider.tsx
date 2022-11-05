import { FC } from 'react'
import ReactSlider from 'react-slider'
import 'twin.macro'
import tw, { styled } from 'twin.macro'
import {
  StakingStepperItemContentBoxHeadline,
  StakingStepperItemContentBoxSubtitle,
} from './StakingStepperItemSharedComponents'
import { StakingViewStakeDonateProps } from './StakingViewStakeDonate'

const StyledSlider = tw(
  ReactSlider
)`cursor-ew-resize overflow-hidden rounded-full bg-green-500 pr-[1.5rem] h-[1.5rem]`
const StyledSliderThumb = tw.div`rounded-full border-2 border-green-500 bg-white w-[1.5rem] h-[1.5rem]`
const StyledTrack = styled.div(({ index }: any) => [
  tw`top-0 bottom-0 rounded-full`,
  index == 1 && tw`bg-gray-200`,
])

export interface StakeDonateImpactEstimationSliderProps extends StakingViewStakeDonateProps {}
export const StakeDonateImpactEstimationSlider: FC<StakeDonateImpactEstimationSliderProps> = () => {
  return (
    <>
      <StakingStepperItemContentBoxHeadline tw="mt-4">
        Estimated Impact
      </StakingStepperItemContentBoxHeadline>
      <StakingStepperItemContentBoxSubtitle>
        See the estimated climate impact for the selected duration.
      </StakingStepperItemContentBoxSubtitle>

      <StyledSlider
        className="atest"
        thumbClassName="atest"
        thumbActiveClassName="atest"
        trackClassName="atest"
        renderThumb={(props, state) => <StyledSliderThumb {...props} />}
        renderTrack={(props, state) => <StyledTrack {...props} index={state.index} />}
      />
    </>
  )
}
