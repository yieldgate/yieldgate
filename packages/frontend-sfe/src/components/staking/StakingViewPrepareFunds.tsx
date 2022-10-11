import { CenterBody } from '@components/layout/CenterBody'
import { FAQItem, FAQSection } from '@components/shared/FaqSection'
import { FC } from 'react'
import tw, { styled } from 'twin.macro'
import { useAccount } from 'wagmi'
import { StakingStepperItemComponentProps } from './StakingHorizontalStepper'

const FullWidthButton = styled.button(() => [
  tw`w-full py-4 px-3 border border-gray-300 rounded text-lg font-medium text-center`,
  tw`not-disabled:hover:(bg-gray-50)`,
])
const FullWidthAnchor = FullWidthButton.withComponent('a')

const faqItems: FAQItem[] = [
  {
    question: 'What kind of funds do I need?',
    answer:
      'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec sed odio dui.',
  },
  {
    question: 'What is a bridge?',
    answer:
      'Maecenas faucibus mollis interdum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
  },
]

export interface StakingViewPrepareFundsProps extends StakingStepperItemComponentProps {}
export const StakingViewPrepareFunds: FC<StakingViewPrepareFundsProps> = ({ onGoNext }) => {
  const { address: userAddress } = useAccount()
  const finalUrl = window?.location?.href
  const rampUrlParams = new URLSearchParams({
    ...(!!userAddress && { userAddress }),
    ...(!!finalUrl && { finalUrl }),
    swapAsset: 'MATIC_USDC',
    hostAppName: 'Stake for Earth',
  }).toString()

  return (
    <>
      <CenterBody>
        <div tw="w-[30rem] flex flex-col items-start">
          <h2 tw="text-2xl font-bold max-w-full mb-6">Prepare Funds</h2>
          <div tw="w-full flex flex-col space-y-5">
            {/* TODO Consider deeper Integration for both */}
            <FullWidthAnchor href={`https://buy.ramp.network/?${rampUrlParams}`} target="_blank">
              Top up wallet with Fiat-Onramp ↗
            </FullWidthAnchor>
            <FullWidthAnchor href="https://transferto.xyz/swap" target="_blank">
              Bridge funds to Polygon ↗
            </FullWidthAnchor>
            <button
              tw="self-center text-sm font-semibold text-primary-500"
              onClick={() => onGoNext()}
            >
              Skip - I already have funds in Polygon
            </button>
            <FAQSection items={faqItems} tw="mt-16!" />
          </div>
        </div>
      </CenterBody>
    </>
  )
}
