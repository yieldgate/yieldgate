import { Flex, Heading, Tooltip, Wrap, WrapItem } from '@chakra-ui/react'
import { BlockiesAvatar } from './BlockiesAvatar'

interface BlockiesAvatarProps {
  sponsors: string[]
}

function SponsorsCard({ sponsors }: BlockiesAvatarProps) {
  if (!sponsors || sponsors.length === 0) return <></>

  return (
    <Flex border="1px" borderRadius="md" p={5} direction="column" gap={3}>
      <Heading size="lg">Sponsors</Heading>
      <Wrap display="flex">
        {sponsors.map((sponsor) => (
          <Tooltip key={sponsor} label={sponsor} fontSize={12} whiteSpace='nowrap'>
            <WrapItem >
              <BlockiesAvatar address={sponsor} borderRadius="full" width={12} />
            </WrapItem>
          </Tooltip>
        ))}
      </Wrap>
    </Flex>
  )
}

export default SponsorsCard
