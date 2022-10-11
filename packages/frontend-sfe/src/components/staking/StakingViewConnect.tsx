import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FC, useEffect } from 'react'
import 'twin.macro'
import { useAccount } from 'wagmi'
import { StakingStepperItemComponentProps } from './StakingHorizontalStepper'

export interface StakingViewConnectProps extends StakingStepperItemComponentProps {}
export const StakingViewConnect: FC<StakingViewConnectProps> = ({
  onGoNext: onNext,
  onGoPrev: onPrev,
  firstRender,
}) => {
  const { isConnected } = useAccount({
    onConnect: ({ address }) => {
      if (address) onNext()
    },
  })

  useEffect(() => {
    if (firstRender && isConnected) onNext()
  }, [])

  return (
    <>
      <div tw="flex flex-col items-center">
        <ConnectButton showBalance={false} />
      </div>
    </>
  )
}
