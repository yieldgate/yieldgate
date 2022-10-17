import { FAQItem, FAQsSection } from '@components/shared/FAQsSection'
import { FC } from 'react'
import 'twin.macro'
import { useAccount } from 'wagmi'
import { StakeDonateBalance } from './StakeDonateBalance'
import { StakingStepperItemComponentProps } from './StakingStepper'
import {
  StakingStepperItemBody,
  StakingStepperItemContinueButton,
  StakingStepperItemFullWidthAnchor,
  StakingStepperItemHeadline,
  StakingStepperItemOuterWrapper,
} from './StakingStepperItemSharedComponents'

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
export const StakingViewPrepareFunds: FC<StakingViewPrepareFundsProps> = (props) => {
  const { onGoNext } = props
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
      <StakingStepperItemOuterWrapper>
        <StakingStepperItemHeadline>Prepare Funds</StakingStepperItemHeadline>
        <StakingStepperItemBody>
          <StakeDonateBalance {...props} />
          {/* TODO Consider deeper Integration for both */}
          <StakingStepperItemFullWidthAnchor
            href={`https://buy.ramp.network/?${rampUrlParams}`}
            target="_blank"
          >
            Top up wallet with Fiat-Onramp ↗
          </StakingStepperItemFullWidthAnchor>
          <StakingStepperItemFullWidthAnchor href="https://transferto.xyz/swap" target="_blank">
            Bridge funds to Polygon ↗
          </StakingStepperItemFullWidthAnchor>
          <StakingStepperItemContinueButton onClick={() => onGoNext()}>
            Skip - I already have funds on Polygon
          </StakingStepperItemContinueButton>
          <FAQsSection items={faqItems} tw="mt-16!" />
        </StakingStepperItemBody>
      </StakingStepperItemOuterWrapper>
    </>
  )
}
