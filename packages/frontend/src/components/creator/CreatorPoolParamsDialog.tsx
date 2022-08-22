import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { useDeployments } from '@lib/useDeployments'
import { FC, useRef, useState } from 'react'

export interface CreatorPoolParamsDialogProps {
  isOpen: boolean
  onClose: () => void
}
export const CreatorPoolParamsDialog: FC<CreatorPoolParamsDialogProps> = ({ isOpen, onClose }) => {
  const initialRef = useRef(null)
  const { contractsChain } = useDeployments()
  const [minAmount, setMinAmount] = useState('0.1')
  const [minDurationDays, setMinDurationDays] = useState(30)
  const [isLoading, setIsLoading] = useState(false)

  const updatePoolParameters = async () => {
    console.log({ minAmount, minDurationDays })
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Pool Parameters</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Change the minimum staking amount and duration of your pool.</Text>
            <FormControl mt={8}>
              <FormLabel htmlFor="amount">Minimum Amount</FormLabel>
              <InputGroup size="sm">
                <Input
                  value={minAmount}
                  onChange={({ target: { value } }) => setMinAmount(value)}
                  ref={initialRef}
                />
                <InputRightAddon>{contractsChain?.nativeCurrency?.symbol}</InputRightAddon>
              </InputGroup>
            </FormControl>
            <FormControl mt={8}>
              <FormLabel htmlFor="amount">Minimum Duration</FormLabel>
              <InputGroup size="sm">
                <Input
                  value={minDurationDays}
                  onChange={({ target: { value } }) => setMinDurationDays(parseInt(value))}
                  type="number"
                  min="0"
                />
                <InputRightAddon>Days</InputRightAddon>
              </InputGroup>
            </FormControl>
            <Button
              mt={8}
              mb={4}
              width="full"
              colorScheme="whatsapp"
              onClick={updatePoolParameters}
            >
              Save Parameters
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
