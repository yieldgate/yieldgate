import { Box, Container, Flex, Image, Link } from '@chakra-ui/react'
import ConnectWallet from '@components/ConnectWallet'
import NextLink from 'next/link'
import * as React from 'react'


function Navbar(): JSX.Element {
  return (
    <Box borderBottom="1px">
      <Container maxW="5xl" py={4}>
        <Flex alignItems="center" justify="space-between">
          <NextLink href="/" passHref>
            <Link>
              <Image src="/images/logo-yieldgate.svg" boxSize={7} alt="Yieldgate Logo"/>
            </Link>
          </NextLink>
          <ConnectWallet />
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
