import { StakeForEarthLogo } from '@components/brand/StakeForEarthLogo'
import { Wrapper } from '@components/layout/Wrapper'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'
import { HomeCTAs } from './HomeCTAs'

export interface HomeFooterProps {}
export const HomeFooter: FC<HomeFooterProps> = () => {
  return (
    <>
      <div tw="bg-gray-100">
        <Wrapper tw="py-6">
          {/* Logo & Nav */}
          <div tw="flex flex-col items-center justify-between space-y-6 md:(flex-row space-y-0)">
            <StakeForEarthLogo href="/" />
            <HomeCTAs />
          </div>

          {/* Legal Links */}
          <div tw="mt-10 flex flex-col items-center justify-between space-y-2 text-xs text-gray-500 md:(flex-row space-y-0)">
            <div>©{dayjs().year()} Stake for Earth Foundation</div>
            <div tw="-mx-2">
              <Link
                href="https://github.com/yieldgate/yieldgate"
                tw="mx-2 cursor-pointer hover:underline"
                target="_blank"
              >
                Github
              </Link>
              <Link href="/legal/privacy" tw="mx-2 cursor-pointer hover:underline">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" tw="mx-2 cursor-pointer hover:underline">
                Terms and Conditions
              </Link>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  )
}
