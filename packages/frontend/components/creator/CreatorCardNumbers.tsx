import { Flex, Heading, HStack, Spinner, Text } from '@chakra-ui/react'
import { Creator } from '@entities/Creator.entity'
import { FC } from 'react'
import { Chain } from 'wagmi'

export interface CreatorCardNumbersProps {
  creator: Creator,
  totalAmountStaked: number,
  totalAmountStakedIsLoading: boolean,
  contractChain: Chain,
}
export const CreatorCardNumbers: FC<CreatorCardNumbersProps> = ({creator, totalAmountStaked, totalAmountStakedIsLoading: isLoading, contractChain}) => {
  return <>
    <HStack spacing={8} mx={8}>
      <Flex direction="column" align="center">
        <Heading>{creator.supportersCount}</Heading>
        <Text>Supporters</Text>
      </Flex>
      <Flex direction="column" align="center">
        {isLoading
          ? <Heading><Spinner /></Heading>
          : <Heading>{totalAmountStaked || '0.0'}</Heading>}
        <Text>Staked {contractChain?.nativeCurrency?.symbol || 'ETH'}</Text>
      </Flex>
      <Flex direction="column" align="center">
        <Heading>{creator.postsCount}</Heading>
        <Text>Posts</Text>
      </Flex>
    </HStack>
  </>
}