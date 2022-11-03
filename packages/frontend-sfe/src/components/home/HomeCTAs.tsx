import { BaseButton } from '@components/shared/BaseButton'
import { FC } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface HomeCTAsProps {
  primaryFirst?: boolean
}
export const HomeCTAs: FC<HomeCTAsProps> = ({ primaryFirst, ...props }) => {
  return (
    <>
      <div tw="-mx-1.5 flex text-sm" {...props}>
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
