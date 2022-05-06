import { Button, Image, Menu, MenuButton, MenuButtonProps, MenuGroup, MenuItem, MenuList, Text, Tooltip } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { BsChevronDown } from 'react-icons/bs'
import { Chain, useNetwork } from 'wagmi'

export interface ChainSwitchMenuProps extends MenuButtonProps {}
export const ChainSwitchMenu: FC<ChainSwitchMenuProps> = ({...props}) => {
  const { activeChain, chains, switchNetworkAsync } = useNetwork()
  const [mainnets, setMainnets] = useState<Chain[]>([])
  const [testnets, setTestnets] = useState<Chain[]>([])
  useEffect(() => {
    const isTestnet = (chain: Chain) => chain.testnet || chain.id === 1337 || chain.id === 31337
    setTestnets((chains || []).filter((chain) => isTestnet(chain)))
    setMainnets((chains || []).filter((chain) => !isTestnet(chain)))
  }, [chains])

  const ChainsMenuGroup: FC<{ chains: Chain[], title: string }> = ({ chains, title }) =>
    <MenuGroup title={title}>
      {chains.map((chain) => (
        <MenuItem key={chain.id} minH='48px' bg={chain.id === activeChain!.id ? 'gray.200' : 'white'}
          disabled={!switchNetworkAsync || chain.id === activeChain!.id}
          onClick={() => switchNetworkAsync?.(chain.id)}>
          <Image src={`/icons/networks/${chain.id || 1}.svg`} alt={chain.name}
            boxSize='2rem' mr='12px' />
          <Text fontWeight={'semibold'}>
            {chain.name}
          </Text>
        </MenuItem>
      ))}
    </MenuGroup>

  if (!activeChain?.id) return <></> 

  return <>
    <Menu >
      <Tooltip label={activeChain.name} aria-label={activeChain.name}>
        <MenuButton as={Button} rightIcon={<BsChevronDown />} bgColor={activeChain?.unsupported ? 'red.100' : ''} {...props}>
          {activeChain?.unsupported
            ? <Text>Unsupported Chain</Text>
            : <Image src={`/icons/networks/${activeChain.id}.svg`} alt={activeChain.name} boxSize='1.5rem' mr="1" />}
        </MenuButton>
      </Tooltip>

      <MenuList>
        { !!mainnets?.length && <ChainsMenuGroup chains={mainnets} title="Mainnets" /> }
        { !!testnets?.length && <ChainsMenuGroup chains={testnets} title="Testnets" /> }
      </MenuList>
    </Menu>
  </>
}