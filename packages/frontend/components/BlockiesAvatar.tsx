import type { ImageProps } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import blockies from 'blockies-ts'
import { ethers } from 'ethers'
import { useMemo } from 'react'

export interface BlockiesAvatarProps extends ImageProps {
  address?: string
}

export const BlockiesAvatar = ({ address = '', ...rest }: BlockiesAvatarProps): JSX.Element => {
  const avatarDataUrl = useMemo(
    () => blockies.create({ seed: ethers.utils.getAddress(address) }).toDataURL(),
    [address]
  )

  return (
    <Image
      src={avatarDataUrl}
      fallbackSrc="https://via.placeholder.com/150"
      alt={address}
      borderRadius="full"
      sx={{ imageRendering: 'pixelated' }}
      {...rest}
    />
  )
}
