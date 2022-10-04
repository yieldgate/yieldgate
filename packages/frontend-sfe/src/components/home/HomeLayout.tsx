import { FC, PropsWithChildren } from 'react'
import 'twin.macro'
import { HomeFooter } from './HomeFooter'
import { HomeNavigationBar } from './HomeNavigationBar'

export interface HomeLayoutProps {}
export const HomeLayout: FC<PropsWithChildren<HomeLayoutProps>> = ({ children }) => {
  return (
    <>
      <HomeNavigationBar />
      {children}
      <HomeFooter />
    </>
  )
}
