import {
  Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useDisclosure, VStack
} from '@chakra-ui/react'
import React from 'react'
import { useConnect } from 'wagmi'

export type ConnectWalletButtonProps = {
  title?: string
}
function ConnectWalletButton({title}: ConnectWalletButtonProps): JSX.Element {
  const { connectors, connect } = useConnect()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect your wallet of choice</ModalHeader>
          <ModalBody>
            <VStack align={'stretch'} pb='4'>
              {connectors?.map((connector) => (
                <Button key={connector.id} onClick={() => connect(connector)}>
                  {connector.name}
                </Button>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Button
        w="220px"
        variant="solid"
        onClick={onOpen}
      >
        {title || 'Connect Wallet'}
      </Button>
    </>
  )
}

export default ConnectWalletButton
