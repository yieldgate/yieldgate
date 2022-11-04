import tw, { styled } from 'twin.macro'

export interface WrapperProps {
  noVerticalPadding?: boolean
  smallVerticalPadding?: boolean
  noHorizontalPadding?: boolean
}
export const Wrapper = styled.div(
  ({ noVerticalPadding, smallVerticalPadding, noHorizontalPadding }: WrapperProps) => [
    tw`relative mx-auto w-full max-w-[1200px]`,
    noVerticalPadding
      ? tw`py-0`
      : smallVerticalPadding
      ? tw`py-6 sm:py-10 lg:py-14`
      : tw`py-12 sm:py-16 lg:py-20`,
    noHorizontalPadding ? tw`px-0` : tw`px-4 sm:px-8`,
  ]
)

export const NegativeWrapper = styled.div(() => [
  tw`relative -mx-4 -my-4 sm:-mx-6 lg:(-mx-8 -my-6)`,
])
