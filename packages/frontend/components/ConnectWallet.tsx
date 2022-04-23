import {
  Button,
  Flex, Menu,
  MenuButton, MenuItem, MenuList, Text
} from '@chakra-ui/react'
import React from 'react'
import { useAccount, useConnect } from 'wagmi'
import { BlockiesAvatar } from './BlockiesAvatar'

function truncateHash(hash: string, length = 38): string {
  return hash.replace(hash.substring(6, length), '...')
}

function ConnectWallet(): JSX.Element {
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  return (
    <>
      {accountData ? (
        <Flex
          order={[-1, null, null, 2]}
          alignItems={'center'}
          justifyContent={['flex-start', null, null, 'flex-end']}
        >
          {/* <Balance /> */}
          <BlockiesAvatar address={accountData.address} ml="4" borderRadius={'full'}/>
          {/* <Image ml="4" src={accountData.ens?.avatar} alt="ENS Avatar" /> */}
          <Menu placement="bottom-end" >
            <MenuButton as={Button} ml="4">
              <Flex direction="column">
                <Text>{truncateHash(accountData.address)}</Text>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={disconnect}>Disconnect</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      ) : (
        <Button
          w="220px"
          variant="solid"
          onClick={() => {
            connect(data.connectors[0])
          }}
        >
          Connect Wallet
        </Button>
      )}
    </>
  )
}

export default ConnectWallet
