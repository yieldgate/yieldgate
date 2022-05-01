import { Box, Flex, Grid, GridItem, Icon, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { BsGithub, BsTwitter } from 'react-icons/bs'
import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <Box as="main">{children}</Box>
      <Grid
        as="footer"
        borderTop="1px"
        p={5}
        mt="12"
        templateColumns="300px 1fr 300px"
      >
        <Flex gap={5}>
          <NextLink href="https://twitter.com/yieldgate" passHref>
            <Link>
              <Icon as={BsTwitter} boxSize="8" color="gray.700" />
            </Link>
          </NextLink>
          <NextLink href="https://github.com/yieldgate" passHref>
            <Link>
              <Icon as={BsGithub} boxSize="8" color="gray.700" />
            </Link>
          </NextLink>
        </Flex>
        <GridItem placeSelf="center">
          Built with ❤️ at ETHGlobal Amsterdam 🇳🇱
        </GridItem>
        <GridItem justifySelf="end">
          <NextLink href="mailto:hi@yieldgate.xyz" passHref>
            <Link>hi@yieldgate.xyz</Link>
          </NextLink>
        </GridItem>
      </Grid>
    </>
  )
}

export default Layout
