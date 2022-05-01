import { Heading, Text, VStack } from '@chakra-ui/react'
import { BlockiesAvatar } from '@components/BlockiesAvatar'
import { Creator } from '@entities/Creator.entity'
import { truncateHash } from '@lib/truncateHash'
import { useEnsDomain } from '@lib/useEnsDomain'
import { FC } from 'react'

export interface CreatorCardDetailsProps {
  creator: Creator
}
export const CreatorCardDetails: FC<CreatorCardDetailsProps> = ({creator}) => {
  const {ensDomain} = useEnsDomain({address: creator.address})

  return <>
    <BlockiesAvatar
      address={creator?.address}
      borderRadius="full"
      width="200px"
      height="200px"
    />
    <VStack w="full">
      <Heading textAlign={'center'}>
        {creator.displayName || ensDomain || truncateHash(creator.address)}
      </Heading>
      <Text textAlign={'center'}>{creator?.description}</Text>
    </VStack>
  </>
}