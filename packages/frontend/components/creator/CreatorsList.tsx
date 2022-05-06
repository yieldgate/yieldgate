import { Button, Flex, Heading, HStack, Input, InputGroup, InputLeftElement, Link, Spacer, Spinner, Text } from '@chakra-ui/react'
import { Creator } from '@entities/Creator.entity'
import { useTotalAmountStaked } from '@lib/creatorReadHooks'
import { truncateHash } from '@lib/truncateHash'
import { useIsSSR } from '@lib/useIsSSR'
import NextLink from 'next/link'
import { FC, useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { BlockiesAvatar } from '../BlockiesAvatar'

export interface CreatorsListItemProps {
  creator: Creator
}
export const CreatorsListItem: FC<CreatorsListItemProps> = ({creator}) => {
  const isSSR = useIsSSR()
  const { totalAmountStaked, isLoading, contractChain } = useTotalAmountStaked({ beneficiary: creator.address })

  return <>
    <NextLink href={`/users/${creator.address}`} passHref>
      <Link _hover={{ textDecoration: 'none' }}>
        <Flex direction="column" border="1px" p={8} borderRadius="md">
          <Flex align="center">
            <BlockiesAvatar address={creator.address} borderRadius="full" width="100px" height="100px"/>
            <Flex direction="column" align="left" mx={8}>
              <Heading>
                {creator.displayName || truncateHash(creator.address)}
              </Heading>
              <Text>{creator.description}</Text>
            </Flex>
            <Spacer />
            <HStack spacing="24px" mx={8}>
              <Flex direction="column" align="center">
                <Heading>{creator.supportersCount}</Heading>
                <Text>Supporters</Text>
              </Flex>
              <Flex direction="column" align="center">
                <Heading>{creator.postsCount}</Heading>
                <Text>Posts</Text>
              </Flex>
              {!isSSR &&
                <Flex direction="column" align="center">
                  {isLoading
                    ? <Heading><Spinner /></Heading>
                    : <Heading>{totalAmountStaked || '0.0'}</Heading>}
                  <Text>Staked {contractChain?.nativeCurrency?.symbol}</Text>
                </Flex>}
            </HStack>
          </Flex>
        </Flex>
      </Link>
    </NextLink>
  </>
}


export interface CreatorsListProps {
  creators: Creator[]
}
export const CreatorsList: FC<CreatorsListProps> = ({creators}) => {
  const [shownCreators, setShownCreators] = useState<Creator[]>([])
  const [searchString, setSearchString] = useState<string>('')
  const [maxShownAmount, setMaxShownAmount] = useState<number>(5)

  const updateFilteredCreators = () => {
    const newShownCreators = creators.filter((creator) => !searchString
        || creator.displayName?.match(new RegExp(searchString, 'i'))
        || creator.address?.match(new RegExp(searchString, 'i'))
        || creator.ensName?.match(new RegExp(searchString, 'i')))
    setShownCreators(newShownCreators)
  }
  useEffect(() => {
    updateFilteredCreators()
  }, [searchString])

  return <>
    <Flex direction="column">
      <Heading mt={24} mb={12} textAlign="center">
            Explore and sponsor our creators
      </Heading>

      {/* Search Field */}
      <InputGroup size="lg">
        <InputLeftElement
          pointerEvents="none"
          children={<BsSearch size={20} />}
        />
        <Input placeholder="Find creator" onChange={(event) => {
          setSearchString(event?.target?.value || '')
        }} />
      </InputGroup>

      {/* Creators List */}
      <Flex direction="column" gap={8} py={8}>
        {(shownCreators || []).slice(0, maxShownAmount).map((creator) => (
          <CreatorsListItem key={creator._id} creator={creator} />
        ))}
      </Flex>

      {/* Show more Button */}
      {(!searchString && maxShownAmount <= creators.length) &&
        <Button onClick={() => { setMaxShownAmount(maxShownAmount + 5) }}>
          Show more
        </Button>}
    </Flex>

  </>
}