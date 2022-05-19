import { Box, Flex, Grid, GridItem, Icon, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { BsGithub, BsTwitter } from 'react-icons/bs'
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
      <Grid
        as="footer"
        templateAreas={{
          base: '"love" "email" "social"',
          md: '"social love email"',
        }}
        templateColumns={{ base: '1fr', md: '180px 1fr 180px' }}
        placeItems="center"
        gap="4"
        borderTop="1px"
        mt="12"
        p="5"
      >
        <Flex gap="4" gridArea="social" justifySelf={{ md: 'start' }}>
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
        <GridItem textAlign="center" gridArea="love">
          Built with ❤️ at ETHGlobal{' '}
          <Text as="span" whiteSpace="nowrap">
            Amsterdam 🇳🇱
          </Text>
        </GridItem>
        <GridItem gridArea="email" justifySelf={{ md: 'end' }}>
          <NextLink href="mailto:hi@yieldgate.xyz" passHref>
            <Link>hi@yieldgate.xyz</Link>
          </NextLink>
        </GridItem>
      </Grid>
    </Flex>
  )
}

export default Layout
