import { FC, PropsWithChildren } from 'react'
import 'twin.macro'

export interface SubheadingProps {
  noHeadingMarkup?: boolean
}

export const Subheading: FC<PropsWithChildren<SubheadingProps>> = ({
  children,
  noHeadingMarkup,
  ...props
}) => {
  const HeadingWrapper = noHeadingMarkup ? 'div' : 'h2'
  return (
    <HeadingWrapper
      tw="max-w-[25rem] font-display text-3xl font-bold tracking-tight mb-4"
      {...props}
    >
      {children}
    </HeadingWrapper>
  )
}

export const SubheadingSmall: FC<PropsWithChildren<SubheadingProps>> = ({
  children,
  noHeadingMarkup,
  ...props
}) => {
  const HeadingWrapper = noHeadingMarkup ? 'div' : 'h2'

  return (
    <HeadingWrapper tw="uppercase font-bold text-xs tracking-wide mb-5 text-gray-800" {...props}>
      {children}
    </HeadingWrapper>
  )
}
