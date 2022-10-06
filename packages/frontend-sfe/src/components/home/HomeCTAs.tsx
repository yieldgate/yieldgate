import { BaseButton } from '@components/shared/BaseButton'
import { FC } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface HomeCTAsProps {
  primaryFirst?: boolean
}
export const HomeCTAs: FC<HomeCTAsProps> = ({ primaryFirst }) => {
  return (
    <>
      <div tw="flex text-sm -mx-1.5">
        <BaseButton
          asLink={true}
          linkProps={{ href: '/stake' }}
          variant="outline"
          css={[tw`mx-1.5`, primaryFirst && tw`order-1`]}
        >
          Donate
        </BaseButton>
        <BaseButton asLink={true} linkProps={{ href: '/stake' }} tw="mx-1.5">
          Stake
        </BaseButton>
      </div>
    </>
  )
}