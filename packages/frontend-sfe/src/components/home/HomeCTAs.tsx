import { BaseButton } from '@components/shared/BaseButton'
import Image from 'next/image'
import Link from 'next/link'
import twitterSvg from 'public/icons/social/twitter.svg'
import { FC } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface HomeCTAsProps {
  primaryFirst?: boolean
  withTwitter?: boolean
}
export const HomeCTAs: FC<HomeCTAsProps> = ({ primaryFirst, withTwitter, ...props }) => {
  return (
    <>
      <div tw="-mx-1.5 flex text-sm" {...props}>
        {/* Twitter Link */}
        {withTwitter && (
          <Link href="https://twitter.com/yieldgate" target="_blank" tw="mr-4 flex items-center">
            <Image
              src={twitterSvg}
              width={18}
              height={18}
              alt="Twitter Logo"
              tw="mr-1.5 brightness-0"
            />
            <div tw="font-medium text-xs">
              <span tw="hidden whitespace-pre sm:inline">Follow on </span>Twitter
            </div>
          </Link>
        )}

        {/* Donate & Stake Buttons */}
        <BaseButton
          asLink={true}
          href="/donate"
          variant="outline"
          css={[tw`mx-1.5`, primaryFirst && tw`order-1`]}
        >
          Donate
        </BaseButton>
        <BaseButton asLink={true} href="/stake" tw="mx-1.5">
          Stake
        </BaseButton>
      </div>
    </>
  )
}
