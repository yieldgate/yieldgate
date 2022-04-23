import {
  Button
} from '@chakra-ui/react'
import React from 'react'
import { useConnect } from 'wagmi'

export type ConnectWalletButtonProps = {
  title?: string
}
function ConnectWalletButton({title}: ConnectWalletButtonProps): JSX.Element {
  const [{ data, error }, connect] = useConnect()

  return (
    <>
      <Button
        w="220px"
        variant="solid"
        onClick={() => {
          connect(data.connectors[0])
        }}
      >
        {title || 'Connect Wallet'}
      </Button>
    </>
  )
}

export default ConnectWalletButton
