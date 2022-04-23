import { Box, Heading, WrapItem, Wrap } from '@chakra-ui/react'
import { BlockiesAvatar } from './BlockiesAvatar'

interface BlockiesAvatarProps {
  sponsors: string[]
}

function SponsorsCard({ sponsors }: BlockiesAvatarProps) {
  if (!sponsors) return <></>

  return (
    <Box border="1px" borderRadius="md">
      <Heading px={8} mt={2}>
        Sponsors
      </Heading>
      <Box p={8}>
        <Wrap display="flex">
          {sponsors.map((sponsor) => (
            <WrapItem key={sponsor}>
              <BlockiesAvatar
                address={sponsor}
                borderRadius="full"
                width={16}
              />
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </Box>
  )
}

export default SponsorsCard
