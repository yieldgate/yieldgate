import tw, { css, styled } from 'twin.macro'

/**
 * StakingStepperItem (Layout)
 */

export const StakingStepperItemOuterWrapper = styled.div(() => [
  tw`relative mx-auto flex h-full w-full flex-col items-start justify-center max-w-[30rem]`,
])

export const StakingStepperItemHeadline = styled.h2(() => [
  tw`mb-6 max-w-full font-bold text-2xl tracking-tight`,
])

export const StakingStepperItemBody = styled.div(() => [tw`flex w-full flex-col space-y-5`])

/**
 * FullWidth & Continue-Buttons
 */

export const StakingStepperItemFullWidthButton = styled.button(({ primary, warning }: any) => [
  tw`flex w-full flex-col items-center justify-center overflow-hidden rounded-md border border-current py-4 px-3 text-center text-lg`,
  primary
    ? tw`bg-gray-900 font-bold text-white not-disabled:hover:bg-gray-800`
    : warning
    ? tw`bg-red-500 font-bold text-white not-disabled:hover:bg-red-400`
    : tw`border-gray-300 font-medium text-black not-disabled:hover:bg-gray-50`,
])
export const StakingStepperItemFullWidthAnchor =
  StakingStepperItemFullWidthButton.withComponent('a')
export const StakingStepperItemFullWidthButtonSubtitle = styled.div(({ primary }: any) => [
  primary
    ? tw`font-semibold text-xs tracking-wide opacity-75`
    : tw`max-w-full truncate font-medium text-xs tracking-wide opacity-50`,
])

export const StakingStepperItemContinueButton = styled.button(() => [
  tw`flex items-center self-center rounded-full border border-primary-300 px-4 py-2 font-semibold text-primary-500 text-sm hover:(border-primary-500 bg-primary-500 text-white)`,
])

/**
 * StakingStepperItemContentBox
 */

export const StakingStepperItemContentBox = styled.div(() => [
  tw`rounded-lg border border-gray-200 px-4 pt-3 pb-3.5 xs:px-6`,
])

export const StakingStepperItemContentBoxHeadline = styled.h3(() => [
  tw`mb-3.5 max-w-full font-semibold text-lg`,
])
export const StakingStepperItemContentBoxSubtitle = styled.p(() => [
  tw`-mt-3 mb-4 text-sm text-gray-600`,
])

export const StakingStepperItemContentBoxDivider = styled.hr(() => [
  tw`-mx-4 my-4 border-gray-200 xs:-mx-6`,
])

export const StakingStepperItemContentBoxSecondaryAction = styled.button(({ disabled }) => [
  tw`flex items-center justify-center whitespace-nowrap font-medium text-xs text-gray-700`,
  disabled ? tw`cursor-not-allowed opacity-80` : tw`hover:text-black`,
  css`
    > svg {
      ${tw`ml-1.5 h-3.5 w-3.5`}
    }
  `,
])
