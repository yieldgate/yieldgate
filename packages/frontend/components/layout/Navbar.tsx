import * as React from 'react'
import { Box, Flex, Image, Container, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

import ConnectWallet from '@components/ConnectWallet'

function Navbar(): JSX.Element {
  return (
    <Box borderBottom="1px">
      <Container maxW="5xl" py={4}>
        <Flex alignItems="center" justify="space-between">
          <NextLink href="/" passHref>
            <Link>
              <Image src="/images/logo-yieldgate.svg" boxSize={7} />
            </Link>
          </NextLink>
          <ConnectWallet />
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
