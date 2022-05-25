import {
  Box, Button,
  Flex,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Spinner, StackProps, Text,
  VStack
} from '@chakra-ui/react'
import { Creator } from '@entities/Creator.entity'
import { useTotalAmountStaked } from '@lib/creatorReadHooks'
import { truncateHash } from '@lib/truncateHash'
import { useIsSSR } from '@lib/useIsSSR'
import NextLink from 'next/link'
import { FC, useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { BlockiesAvatar } from '../BlockiesAvatar'

interface StatProps extends StackProps {
  isLoading?: boolean
  label: string
  value: number | string
}

const Stat = ({
  isLoading = false,
  label,
  value,
  ...rest
}: StatProps): JSX.Element => {
  return (
    <VStack spacing="0" {...rest}>
      {isLoading
        ? <Box flexGrow={1} display='flex' justifyContent={'center'} alignItems={'center'}><Spinner /></Box>
        : <Text fontSize={{ base: '2xl', lg: '3xl' }} fontWeight="bold">{value}</Text>
      }
      <Text
        fontSize={{ base: 'sm', lg: 'md' }}
        textAlign="center"
        whiteSpace="nowrap"
      >
        {label}
      </Text>
    </VStack>
  )
}

export interface CreatorsListItemProps {
  creator: Creator
}

export const CreatorsListItem = ({
  creator,
}: CreatorsListItemProps): JSX.Element => {
  const isSSR = useIsSSR()
  const { totalAmountStaked, isLoading, contractChain } = useTotalAmountStaked({
    beneficiary: creator.address,
  })

  return (
    <NextLink href={`/users/${creator.address}`} passHref>
      <Link _hover={{ textDecoration: 'none' }}>
        <Grid
          templateAreas={{
            base: '"avatar" "name" "stats"',
            sm: '"avatar name" "avatar stats"',
            md: '"avatar name stats"',
          }}
          templateColumns={{
            base: '1fr',
            sm: 'auto auto',
            md: 'auto auto 1fr',
          }}
          gap={{
            base: '2',
            sm: '5',
            md: '8',
          }}
          placeItems="center"
          placeContent="center"
          p="8"
          border="1px"
          borderRadius="md"
        >
          <BlockiesAvatar
            address={creator.address}
            width={{ base: '80px', sm: '100px' }}
            gridArea="avatar"
            justifySelf="center"
          />
          <Flex direction="column" gridArea="name">
            <Heading
              textAlign={{ base: 'center', md: 'left' }}
              fontSize={{ base: '2xl', sm: '3xl' }}
            >
              {creator.displayName || truncateHash(creator.address)}
            </Heading>
            <Text textAlign={{ base: 'center', md: 'left' }}>
              {creator.description}
            </Text>
          </Flex>
          <Flex
            gap="2"
            wrap="wrap"
            justifyContent="center"
            gridArea="stats"
            justifySelf={{ base: 'center', md: 'end' }}
          >
            {creator.supportersCount && (
              <Stat label="Supporters" value={creator.supportersCount} />
            )}
            {creator.postsCount && (
              <Stat label="Posts" value={creator.postsCount} />
            )}
            {!isSSR && (
              <Stat
                isLoading={isLoading}
                label={`Stakes ${contractChain?.nativeCurrency?.symbol}`}
                value={totalAmountStaked || '0.0'}
              />
            )}
          </Flex>
        </Grid>
      </Link>
    </NextLink>
  )
}

export interface CreatorsListProps {
  creators: Creator[]
}

export const CreatorsList: FC<CreatorsListProps> = ({ creators }) => {
  const [shownCreators, setShownCreators] = useState<Creator[]>([])
  const [searchString, setSearchString] = useState<string>('')
  const [maxShownAmount, setMaxShownAmount] = useState<number>(5)

  const updateFilteredCreators = () => {
    const newShownCreators = creators.filter(
      (creator) =>
        !searchString ||
        creator.displayName?.match(new RegExp(searchString, 'i')) ||
        creator.address?.match(new RegExp(searchString, 'i')) ||
        creator.ensName?.match(new RegExp(searchString, 'i'))
    )
    setShownCreators(newShownCreators)
  }
  useEffect(() => {
    updateFilteredCreators()
  }, [searchString])

  return (
    <>
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
          <Input
            placeholder="Find creator"
            onChange={(event) => {
              setSearchString(event?.target?.value || '')
            }}
          />
        </InputGroup>

        {/* Creators List */}
        <Flex direction="column" gap={8} py={8}>
          {(shownCreators || []).slice(0, maxShownAmount).map((creator) => (
            <CreatorsListItem key={creator._id} creator={creator} />
          ))}
        </Flex>

        {/* Show more Button */}
        {!searchString && maxShownAmount <= creators.length && (
          <Button
            onClick={() => {
              setMaxShownAmount(maxShownAmount + 5)
            }}
          >
            Show more
          </Button>
        )}
      </Flex>
    </>
  )
}
