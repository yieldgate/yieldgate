import { CenterBody } from '@components/layout/CenterBody'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FC, useEffect } from 'react'
import 'twin.macro'
import { useAccount } from 'wagmi'
import { StakingStepperItemComponentProps } from './StakingHorizontalStepper'

export interface StakingViewConnectProps extends StakingStepperItemComponentProps {}
export const StakingViewConnect: FC<StakingViewConnectProps> = ({
  onGoNext,
  onGoPrev,
  firstRender,
}) => {
  // Navigate to next tab when wallet connected successfully
  const { isConnected } = useAccount({
    onConnect: ({ address }) => {
      if (address) onGoNext()
    },
  })

  // Navigate to next tab when tab is opened for the first time
  // and the wallet was already connected
  useEffect(() => {
    if (firstRender && isConnected) onGoNext()
  }, [])

  return (
    <>
      <CenterBody>
        <ConnectButton showBalance={false} />
        {isConnected && (
          <button tw="mt-6 text-sm font-semibold text-primary-500" onClick={() => onGoNext()}>
            Continue to Prepare Funds
          </button>
        )}
      </CenterBody>
    </>
  )
}
