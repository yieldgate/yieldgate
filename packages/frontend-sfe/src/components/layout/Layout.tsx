import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <Flex direction="column" minH="100vh">
      <header>
        <Navbar />
      </header>
      <Box as="main" flexGrow={1}>
        {children}
      </Box>
      <Footer />
    </Flex>
  )
}

export default Layout
