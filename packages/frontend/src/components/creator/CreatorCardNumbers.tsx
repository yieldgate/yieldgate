import { Box, Flex, Heading, HStack, Spinner, Text, useMediaQuery, VStack } from '@chakra-ui/react'
import { Creator } from '@entities/Creator.entity'
import { FC } from 'react'
import { Chain } from 'wagmi'

export interface CreatorCardNumbersProps {
  creator: Creator
  totalAmountStaked: number | undefined
  totalAmountStakedIsLoading: boolean
  contractsChain: Chain
  minAmount?: string
  minDurationDays?: number
  poolParamsAreLoading: boolean
}
export const CreatorCardNumbers: FC<CreatorCardNumbersProps> = ({
  creator,
  totalAmountStaked,
  totalAmountStakedIsLoading: isLoading,
  contractsChain,
  minAmount,
  minDurationDays,
  poolParamsAreLoading,
}) => {
  const [isMobile] = useMediaQuery('(max-width: 500px)')
  const currencySymbol = contractsChain?.nativeCurrency?.symbol || 'ETH'

  return (
    <>
      <VStack spacing={6}>
        {/* Pool Numbers (Supporters, Staked Amount, Posts) */}
        <HStack spacing={8} mx={8} wrap="wrap" placeContent="center">
          <Flex direction="column" align="center">
            <Heading>{creator.supportersCount}</Heading>
            <Text textAlign="center" fontSize="sm">
              Supporters
            </Text>
          </Flex>
          <Flex direction="column" align="center">
            {isLoading ? (
              <Heading>
                <Spinner />
              </Heading>
            ) : (
              <Heading>{totalAmountStaked || '0.0'}</Heading>
            )}
            <Text textAlign="center" fontSize="sm">
              {!isMobile && 'Staked '} {currencySymbol}
            </Text>
          </Flex>
          <Flex direction="column" align="center" fontSize="sm">
            <Heading>{creator.postsCount}</Heading>
            <Text textAlign="center" fontSize="sm">
              Posts
            </Text>
          </Flex>
        </HStack>

        {/* Pool Parameters */}
        <Box>
          <Text fontSize="xs" textAlign={'center'} color={'gray.500'}>
            {minAmount === undefined || minDurationDays === undefined || poolParamsAreLoading ? (
              'Pool Parameters are fetched…'
            ) : (
              <>
                Minimum amount to stake:{' '}
                <strong>
                  {minAmount} {currencySymbol}
                </strong>
                <br />
                Minimum duration to stake: <strong>{minDurationDays} Days</strong>
              </>
            )}
          </Text>
        </Box>
      </VStack>
    </>
  )
}
