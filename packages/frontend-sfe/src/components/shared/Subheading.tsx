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
        tw="mb-4 font-display font-bold text-3xl tracking-tight max-w-[30rem] lg:text-4xl"
        {...props}
      >
        {children}
      </HeadingWrapper>
      {tagline && <p tw="-mt-1.5 mb-4 text-sm opacity-75">{tagline}</p>}
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
    <HeadingWrapper tw="mb-4 font-bold text-xs text-gray-800 uppercase tracking-wide" {...props}>
      {children}
    </HeadingWrapper>
  )
}
