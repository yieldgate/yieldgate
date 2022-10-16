import tw, { styled } from 'twin.macro'

/**
 * StakingStepperItem (Layout)
 */

export const StakingStepperItemOuterWrapper = styled.div(() => [
  tw`h-full w-[30rem] mx-auto flex flex-col justify-center items-start relative`,
])

export const StakingStepperItemHeadline = styled.h2(() => [
  tw`text-2xl font-bold max-w-full mb-6 tracking-tight`,
])

export const StakingStepperItemBody = styled.div(() => [tw`w-full flex flex-col space-y-5`])

/**
 * FullWidthButton
 */

export const StakingStepperItemFullWidthButton = styled.button(() => [
  tw`w-full py-4 px-3 border border-gray-300 rounded text-lg font-medium text-center`,
  tw`not-disabled:hover:(bg-gray-50)`,
])
export const StakingStepperItemFullWidthAnchor =
  StakingStepperItemFullWidthButton.withComponent('a')

/**
 * StakingStepperItemContentBox
 */

export const StakingStepperItemContentBox = styled.div(() => [
  tw`pt-3 pb-3.5 px-6 rounded-lg border border-gray-200`,
])

export const StakingStepperItemContentBoxHeadline = styled.h3(() => [
  tw`text-lg font-semibold max-w-full mb-4`,
])
export const StakingStepperItemContentBoxSubtitle = styled.p(() => [
  tw`text-sm text-gray-600 -mt-3 mb-4`,
])

export const StakingStepperItemContentBoxDivider = styled.hr(() => [tw`-mx-6 my-4 border-gray-200`])
