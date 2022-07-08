import {
  Button,
  Image,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { BsChevronDown } from 'react-icons/bs'
import { Chain, useNetwork, useSwitchNetwork } from 'wagmi'

export interface ChainSwitchMenuProps extends MenuButtonProps {}
export const ChainSwitchMenu: FC<ChainSwitchMenuProps> = ({ ...props }) => {
  const { chain, chains } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const [mainnets, setMainnets] = useState<Chain[]>([])
  const [testnets, setTestnets] = useState<Chain[]>([])
  useEffect(() => {
    const isTestnet = (chain: Chain) => chain.testnet || chain.id === 1337 || chain.id === 31337
    setTestnets((chains || []).filter((chain) => isTestnet(chain)))
    setMainnets((chains || []).filter((chain) => !isTestnet(chain)))
  }, [chains])

  const ChainsMenuGroup: FC<{ chains: Chain[]; title: string }> = ({ chains, title }) => {
    if (!chain?.id) return <></>

    return (
      <MenuGroup title={title}>
        {chains.map((chain) => (
          <MenuItem
            key={chain.id}
            minH="48px"
            bg={chain.id === chain.id ? 'gray.200' : 'white'}
            disabled={!switchNetworkAsync || chain.id === chain.id}
            onClick={() => switchNetworkAsync?.(chain.id)}
          >
            <Image
              src={`/icons/networks/${chain.id || 1}.svg`}
              alt={chain.name}
              boxSize="2rem"
              mr="12px"
            />
            <Text fontWeight={'semibold'}>{chain.name}</Text>
          </MenuItem>
        ))}
      </MenuGroup>
    )
  }

  if (!chain?.id) return <></>

  return (
    <>
      <Menu>
        <Tooltip label={chain.name} aria-label={chain.name} gutter={10}>
          <MenuButton
            as={Button}
            rightIcon={<BsChevronDown />}
            bgColor={chain?.unsupported ? 'red.100' : ''}
            {...props}
          >
            {chain?.unsupported ? (
              <Text>Invalid Chain</Text>
            ) : (
              <Image
                src={`/icons/networks/${chain.id}.svg`}
                alt={chain.name}
                boxSize="1.5rem"
                mr="1"
              />
            )}
          </MenuButton>
        </Tooltip>

        <MenuList>
          {!!mainnets?.length && <ChainsMenuGroup chains={mainnets} title="Mainnets" />}
          {!!testnets?.length && <ChainsMenuGroup chains={testnets} title="Testnets" />}
        </MenuList>
      </Menu>
    </>
  )
}
