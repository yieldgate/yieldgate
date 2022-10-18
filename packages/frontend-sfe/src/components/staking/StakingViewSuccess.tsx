import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import twitterSvg from 'public/icons/social/twitter.svg'
import badgePlaceholderImg from 'public/images/badge-placeholder.png'
import { FC } from 'react'
import 'twin.macro'
import tw, { styled } from 'twin.macro'
import { StakingStepperItemComponentProps } from './StakingStepper'
import {
  StakingStepperItemBody,
  StakingStepperItemContentBox,
  StakingStepperItemContentBoxDivider,
  StakingStepperItemContentBoxHeadline,
  StakingStepperItemContentBoxSubtitle,
  StakingStepperItemHeadline,
  StakingStepperItemOuterWrapper,
} from './StakingStepperItemSharedComponents'

export interface StakingViewSuccessProps extends StakingStepperItemComponentProps {}
export const StakingViewSuccess: FC<StakingViewSuccessProps> = ({ mode }) => {
  return (
    <>
      <StakingStepperItemOuterWrapper tw="items-center">
        <StakingStepperItemHeadline tw="flex items-center">
          {mode === 'donate' ? 'Donated successfully' : 'Staked successfully'}
          <CheckCircleIcon tw="h-7 w-7 ml-2  shrink-0 grow-0 text-green-500" />
        </StakingStepperItemHeadline>
        <StakingStepperItemBody tw="items-center">
          <StakingStepperItemContentBox tw="w-[25rem] text-center">
            <StakingStepperItemContentBoxHeadline>
              Your Supporter Badge
            </StakingStepperItemContentBoxHeadline>
            <StakingStepperItemContentBoxSubtitle>Minted NFT</StakingStepperItemContentBoxSubtitle>

            {/* Staking Badge (TODO) */}
            <div tw="w-[13rem] mx-auto mb-[-1rem]">
              <Image width={742} height={1000} src={badgePlaceholderImg} alt="Staking Badge NFT" />
            </div>
            <StakingStepperItemContentBoxDivider />

            {/* Actions */}
            <BaseButtonGroup tw="grid grid-cols-1">
              <BaseButton
                asLink={true}
                linkProps={{ href: 'https://doingud.com/' }}
                target="_blank"
              >
                View on DoinGud ↗
              </BaseButton>
            </BaseButtonGroup>
          </StakingStepperItemContentBox>

          {/* Share Buttons */}
          <StakingViewSuccessShareButtons />
        </StakingStepperItemBody>
      </StakingStepperItemOuterWrapper>
    </>
  )
}

const SuccessShareButton = styled.button(() => [
  tw`flex items-center space-x-2 tracking-tight font-semibold underline underline-offset-4 whitespace-nowrap`,
])
const SuccessShareButtonAnchor = SuccessShareButton.withComponent('a')

export interface StakingViewSuccessShareButtonsProps {}
export const StakingViewSuccessShareButtons: FC<StakingViewSuccessShareButtonsProps> = () => {
  const twitterShareUrlParams = new URLSearchParams({
    text: `Stake for Earth\nhttps://stakefor.earth`,
    via: 'yieldgate',
  }).toString()
  const twitterShareUrl = `https://twitter.com/intent/tweet?${twitterShareUrlParams}`

  return (
    <>
      <div tw="mt-8!">
        <SuccessShareButtonAnchor href={twitterShareUrl} target="_blank">
          <Image src={twitterSvg} width={26} height={26} alt="Twitter Logo" />
          <div>Share on Twitter</div>
        </SuccessShareButtonAnchor>
      </div>
    </>
  )
}
