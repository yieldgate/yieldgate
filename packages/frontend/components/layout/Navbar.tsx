import * as React from 'react'
import { Flex, Image } from '@chakra-ui/react'

import ConnectWallet from '@components/ConnectWallet'

function Navbar(): JSX.Element {
  return (
    <Flex alignItems="center" justify="space-between" borderBottom="1px" p="2">
      <Image src="images/logo-yieldgate.svg" boxSize={7} />
      <ConnectWallet />
    </Flex>
  )
}

export default Navbar
