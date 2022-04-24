import { Box, Image } from '@chakra-ui/react'
import blockies from 'blockies-ts'
import { FC, useEffect, useState } from 'react'

export interface BlockiesAvatarProps {
  address: string
  ml?: string
  borderRadius?: string
  width?: string | number
  height?: string | number
  cursor?: string
}
export const BlockiesAvatar: FC<BlockiesAvatarProps> = ({
  address,
  ...props
}) => {
  const [avatarUri, setAvatarUri] = useState('')
  useEffect(() => {
    let blockieImageSrc
    if (typeof window !== 'undefined') {
      blockieImageSrc = blockies.create({ seed: (address || '').toLowerCase() }).toDataURL()
    }
    setAvatarUri(blockieImageSrc)
  }, [])

  return (
    <Box>
      <Image
        src={avatarUri}
        fallbackSrc="https://via.placeholder.com/150"
        alt={address}
        style={{ imageRendering: 'pixelated' }}
        {...props}
      />
    </Box>
  )
}
