import { StakeForEarthLogo } from '@components/brand/StakeForEarthLogo'
import { Wrapper } from '@components/layout/Wrapper'
import { BaseButton } from '@components/shared/BaseButton'
import { FC } from 'react'
import 'twin.macro'

export interface HomeNavigationBarProps {}
export const HomeNavigationBar: FC<HomeNavigationBarProps> = () => {
  return (
    <>
      <div tw="bg-gray-100">
        <Wrapper noVerticalPadding tw="py-5">
          <div tw="flex justify-between items-center">
            <StakeForEarthLogo hideTextOnSmall={true} />
            <div tw="text-sm space-x-2">
              <BaseButton asLink={true} linkProps={{ href: '/staking' }} variant="outline">
                Donate
              </BaseButton>
              <BaseButton asLink={true} linkProps={{ href: '/staking' }}>
                Stake
              </BaseButton>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  )
}
