import { StakeForEarthLogo } from '@components/brand/StakeForEarthLogo'
import { Wrapper } from '@components/layout/Wrapper'
import { BaseButton } from '@components/shared/BaseButton'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'

export interface HomeFooterProps {}
export const HomeFooter: FC<HomeFooterProps> = () => {
  return (
    <>
      <div tw="bg-gray-100">
        <Wrapper tw="py-5">
          {/* Logo & Nav */}
          <div tw="flex flex-col space-y-6 md:(flex-row space-y-0) justify-between items-center">
            <StakeForEarthLogo />
            <div tw="text-sm space-x-2">
              <BaseButton asLink={true} linkProps={{ href: '/staking' }} variant="outline">
                Donate
              </BaseButton>
              <BaseButton asLink={true} linkProps={{ href: '/staking' }}>
                Stake
              </BaseButton>
            </div>
          </div>

          {/* Legal Links */}
          <div tw="mt-10 flex flex-col items-center space-y-2 md:(flex-row space-y-0) justify-between text-xs text-gray-500">
            <div>©{dayjs().year()} Stake for Earth Foundation</div>
            <div tw="-mx-2">
              <Link href="/legal/privacy" passHref>
                <a tw="mx-2 cursor-pointer hover:underline">Privacy Policy</a>
              </Link>
              <Link href="/legal/privacy" passHref>
                <a tw="mx-2 cursor-pointer hover:underline">Terms and Conditions</a>
              </Link>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  )
}
