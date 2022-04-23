import * as React from 'react'
import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { BsGoogle } from 'react-icons/bs'
import { BiSearch } from 'react-icons/bi'

import ConnectWallet from '@components/ConnectWallet'

function Navbar(): JSX.Element {
  return (
    <Flex alignItems="center" justify="space-between" borderBottom="1px" p="2">
      <BsGoogle size="2em" />
      <Flex gap="5">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<BiSearch color="gray.300" />}
          />
          <Input placeholder="Find creator" />
        </InputGroup>
        <ConnectWallet />
      </Flex>
    </Flex>
  )
}

export default Navbar
