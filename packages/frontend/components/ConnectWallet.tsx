import {
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  Text,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { CHAIN_NAMES, useEthers } from '@usedapp/core'
import blockies from 'blockies-ts'
import React from 'react'
import Balance from './Balance'

function truncateHash(hash: string, length = 38): string {
  return hash.replace(hash.substring(6, length), '...')
}

function ConnectWallet(): JSX.Element {
  const { account, activateBrowserWallet, activate, deactivate, chainId } =
    useEthers()
  console.log(account)

  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
  }

  return (
    <>
      {account ? (
        <Flex
          order={[-1, null, null, 2]}
          alignItems={'center'}
          justifyContent={['flex-start', null, null, 'flex-end']}
        >
          <Balance />
          <Image ml="4" src={blockieImageSrc} alt="blockie" />
          <Menu placement="bottom-end">
            <MenuButton as={Button} ml="4">
              <Flex direction="column">
                <Text>{truncateHash(account)}</Text>
                <Text fontSize="xs" color="gray.500">
                  {CHAIN_NAMES[chainId]}
                </Text>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={deactivate}>Disconnect</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      ) : (
        <Button
          w="220px"
          variant="solid"
          onClick={() => {
            activateBrowserWallet()
          }}
        >
          Connect Wallet
        </Button>
      )}
    </>
  )
}

export default ConnectWallet
