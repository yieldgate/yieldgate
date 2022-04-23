import {
  Button
} from '@chakra-ui/react'
import React from 'react'
import { useConnect } from 'wagmi'

function ConnectWalletButton(): JSX.Element {
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
          Connect Wallet
      </Button>
    </>
  )
}

export default ConnectWalletButton
