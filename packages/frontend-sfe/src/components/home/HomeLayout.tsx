import { FC, PropsWithChildren } from 'react'
import 'twin.macro'
import { HomeFooter } from './HomeFooter'
import { HomeNavigationBar } from './HomeNavigationBar'

export interface HomeLayoutProps {}
export const HomeLayout: FC<PropsWithChildren<HomeLayoutProps>> = ({ children }) => {
  return (
    <>
      <div tw="relative flex min-h-full flex-col">
        <HomeNavigationBar />
        <main tw="relative flex grow flex-col">{children}</main>
        <HomeFooter />
      </div>
    </>
  )
}
