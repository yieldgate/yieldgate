import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { useEnsDomain } from '@lib/useEnsDomain'
import { useIsSSR } from '@lib/useIsSSR'
import Link from 'next/link'
import { useAccount, useDisconnect } from 'wagmi'
import { BlockiesAvatar } from './BlockiesAvatar'
import { ChainSwitchMenu } from './ChainSwitchMenu'
import ConnectWalletButton from './ConnectWalletButton'

function truncateHash(hash: string, length = 38): string {
  return hash.replace(hash.substring(6, length), '...')
}

function ConnectWallet(): JSX.Element {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const isSSR = useIsSSR()
  const { ensDomain } = useEnsDomain({ address })

  if (isSSR || !address) return <ConnectWalletButton />

  return (
    <Flex alignItems={'center'}>
      {/* Avatar */}
      <Link href={`/users/${(address || '').toLowerCase()}`} passHref>
        <div>
          <BlockiesAvatar address={address} ml="4" borderRadius={'full'} cursor="pointer" />
        </div>
      </Link>

      {/* Chain Switch Menu */}
      <ChainSwitchMenu ml="4" />

      {/* Address / ENS-Name */}
      <Menu placement="bottom-end">
        <MenuButton as={Button} ml="4">
          <Flex direction="column">
            <Text>{ensDomain || truncateHash(address || '')}</Text>
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => disconnect()}>Disconnect</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default ConnectWallet
