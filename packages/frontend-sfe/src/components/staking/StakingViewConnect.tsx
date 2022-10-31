import { FAQItem, FAQsSection } from '@components/shared/FAQsSection'
import { useAccountModal, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { FC, useEffect } from 'react'
import 'twin.macro'
import { useAccount, useDisconnect, useEnsName, useNetwork } from 'wagmi'
import { StakingStepperItemComponentProps } from './StakingStepper'
import {
  StakingStepperItemBody,
  StakingStepperItemContinueButton,
  StakingStepperItemFullWidthButton,
  StakingStepperItemFullWidthButtonSubtitle,
  StakingStepperItemHeadline,
  StakingStepperItemOuterWrapper,
} from './StakingStepperItemSharedComponents'

const faqItems: FAQItem[] = [
  {
    question: 'What is a Wallet?',
    answer:
      'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec sed odio dui.',
  },
  {
    question: 'Can I log-in with my Email?',
    answer:
      'Maecenas faucibus mollis interdum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
  },
]

export interface StakingViewConnectProps extends StakingStepperItemComponentProps {}
export const StakingViewConnect: FC<StakingViewConnectProps> = ({
  onGoNext,
  onGoPrev,
  firstRender,
}) => {
  // Navigate to next tab when wallet connected correctly
  const { chain } = useNetwork()
  const { isConnected } = useAccount({
    onConnect: ({ address }) => {
      if (!!address && !chain?.unsupported) onGoNext()
    },
  })

  // Navigate to next tab when tab is opened for the first time
  // and the wallet was already connected correctly
  useEffect(() => {
    if (firstRender && isConnected && !chain?.unsupported) onGoNext()
  }, [])

  return (
    <>
      <StakingStepperItemOuterWrapper>
        <StakingStepperItemHeadline>Authentication</StakingStepperItemHeadline>
        <StakingStepperItemBody>
          <StakingViewConnectButton />
          {isConnected && !chain?.unsupported && (
            <StakingStepperItemContinueButton tw="mt-6" onClick={() => onGoNext()}>
              Continue to Prepare Funds
            </StakingStepperItemContinueButton>
          )}
          <FAQsSection items={faqItems} tw="mt-16!" />
        </StakingStepperItemBody>
      </StakingStepperItemOuterWrapper>
    </>
  )
}

export const StakingViewConnectButton: FC = () => {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal()
  const { disconnect } = useDisconnect()

  return (
    <>
      {!isConnected && (
        <StakingStepperItemFullWidthButton onClick={openConnectModal} primary>
          Connect Wallet
        </StakingStepperItemFullWidthButton>
      )}
      {isConnected && (
        <>
          <StakingStepperItemFullWidthButton onClick={disconnect} title={address}>
            <div>Disconnect Wallet</div>
            <StakingStepperItemFullWidthButtonSubtitle>
              {/* <StakingStepperItemFullWidthButtonSubtitle tw="flex items-center space-x-1">
              <WalletIcon tw="h-[.95rem] w-[.95rem] text-gray-800" /> */}
              <div>{ensName || address}</div>
            </StakingStepperItemFullWidthButtonSubtitle>
          </StakingStepperItemFullWidthButton>
          <StakingStepperItemFullWidthButton
            onClick={openChainModal}
            warning={!!chain?.unsupported}
          >
            <div>Switch Chain</div>
            {!!chain && (
              <StakingStepperItemFullWidthButtonSubtitle primary={!!chain?.unsupported}>
                {chain?.unsupported ? `${chain.name} is unsupported` : chain.name}
              </StakingStepperItemFullWidthButtonSubtitle>
            )}
          </StakingStepperItemFullWidthButton>
        </>
      )}
    </>
  )
}
