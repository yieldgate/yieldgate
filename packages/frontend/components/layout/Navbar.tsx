import * as React from 'react'
import { Box, Flex, Image, Container } from '@chakra-ui/react'

import ConnectWallet from '@components/ConnectWallet'

function Navbar(): JSX.Element {
  return (
    <Box borderBottom="1px">
      <Container maxW="5xl" py={4}>
        <Flex alignItems="center" justify="space-between">
          <Image src="/images/logo-yieldgate.svg" boxSize={7} />
          <ConnectWallet />
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
