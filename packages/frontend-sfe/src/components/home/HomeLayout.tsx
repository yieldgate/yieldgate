import { FC, PropsWithChildren } from 'react'
import 'twin.macro'
import { HomeFooter } from './HomeFooter'
import { HomeNavigationBar } from './HomeNavigationBar'

export interface HomeLayoutProps {}
export const HomeLayout: FC<PropsWithChildren<HomeLayoutProps>> = ({ children }) => {
  return (
    <>
      <div tw="min-h-full flex flex-col relative">
        <HomeNavigationBar />
        <main tw="grow flex flex-col relative">{children}</main>
        <HomeFooter />
      </div>
    </>
  )
}
