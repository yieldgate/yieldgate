import {
  Box, Flex
} from '@chakra-ui/react'
import React from 'react'
import Head, { MetaProps } from './Head'
import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  return (
    <>
      <Head customMeta={customMeta} />
      <header>
        <Navbar />
      </header>
      <Box as="main">
        {children}
      </Box>
      <Flex as="footer" borderTop="1px" p={2} justify="center" mt='12'>
        Built with ❤️ at ETHGlobal Amsterdam 🇳🇱
      </Flex>
    </>
  )
}

export default Layout
