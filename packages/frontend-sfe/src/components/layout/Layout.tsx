import { FC, PropsWithChildren } from 'react'
import 'twin.macro'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div tw="grow">{children}</div>
    </>
  )
}
