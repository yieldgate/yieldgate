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
import { FC, useState } from 'react'

export interface SupporterStakeDialogProps {
  isOpen: boolean
  onClose: () => void
  stake: (_: string) => void
}
export const SupporterStakeDialog: FC<SupporterStakeDialogProps> = ({ isOpen, onClose, stake }) => {
  const { contractsChain } = useDeployments()
  const [amount, setAmount] = useState('0.1')

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How much do you want to stake?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You can unstake and get the full amount minus gas fees back anytime.</Text>
            <FormControl mt={8}>
              <FormLabel htmlFor="amount">Amount to stake</FormLabel>
              <InputGroup size="sm">
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
                <InputRightAddon>{contractsChain?.nativeCurrency?.symbol}</InputRightAddon>
              </InputGroup>
            </FormControl>
            <Button
              my={8}
              width="full"
              onClick={() => {
                stake(amount)
                onClose()
              }}
            >
              Stake now
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
