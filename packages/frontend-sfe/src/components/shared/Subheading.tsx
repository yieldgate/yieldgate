import { FC, PropsWithChildren } from 'react'
import 'twin.macro'

export interface SubheadingProps {}
export const Subheading: FC<PropsWithChildren<SubheadingProps>> = ({ children, ...props }) => {
  return (
    <>
      <h2 tw="uppercase font-bold text-xs tracking-wide mb-5 text-gray-800" {...props}>
        {children}
      </h2>
    </>
  )
}
