import { FC, PropsWithChildren } from 'react'
import 'twin.macro'

export interface SubheadingProps {
  noHeadingMarkup?: boolean
  tagline?: string
}

export const Subheading: FC<PropsWithChildren<SubheadingProps>> = ({
  children,
  noHeadingMarkup,
  tagline,
  ...props
}) => {
  const HeadingWrapper = noHeadingMarkup ? 'div' : 'h2'
  return (
    <>
      <HeadingWrapper
        tw="max-w-[30rem] text-3xl lg:text-4xl font-display font-bold tracking-tight mb-4"
        {...props}
      >
        {children}
      </HeadingWrapper>
      {tagline && <p tw="text-sm opacity-75 -mt-1.5 mb-4">{tagline}</p>}
    </>
  )
}

export const SubheadingSmall: FC<PropsWithChildren<SubheadingProps>> = ({
  children,
  noHeadingMarkup,
  ...props
}) => {
  const HeadingWrapper = noHeadingMarkup ? 'div' : 'h2'

  return (
    <HeadingWrapper tw="uppercase font-bold text-xs tracking-wide mb-4 text-gray-800" {...props}>
      {children}
    </HeadingWrapper>
  )
}
