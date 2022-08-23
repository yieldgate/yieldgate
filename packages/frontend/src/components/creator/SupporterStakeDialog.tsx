import {
  Alert,
  AlertIcon,
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
  VStack,
} from '@chakra-ui/react'
import { useDeployments } from '@lib/useDeployments'
import dayjs from 'dayjs'
import { FC, useRef, useState } from 'react'

export interface SupporterStakeDialogProps {
  isOpen: boolean
  onClose: () => void
  stake: (_: string) => void
  minDurationDays?: number
}
export const SupporterStakeDialog: FC<SupporterStakeDialogProps> = ({
  isOpen,
  onClose,
  stake,
  minDurationDays,
}) => {
  const initialRef = useRef(null)
  const { contractsChain } = useDeployments()
  const [amount, setAmount] = useState('0.01')
  const stakeLockedUntil = dayjs()
    .add(minDurationDays || 0, 'days')
    .format('YYYY/MM/DD')

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How much do you want to stake?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              After staking, yield will be generated on the creators behalf but the staked amount
              stays yours.
            </Text>
            <FormControl mt={8} mb={4}>
              <FormLabel htmlFor="amount">Amount to stake</FormLabel>
              <InputGroup size="sm">
                <Input
                  value={amount}
                  onChange={({ target: { value } }) => setAmount(value)}
                  ref={initialRef}
                />
                <InputRightAddon>{contractsChain?.nativeCurrency?.symbol}</InputRightAddon>
              </InputGroup>
            </FormControl>

            {/* Staking Lock Info  */}
            {!!minDurationDays && (
              <Alert fontSize="sm" colorScheme="blackAlpha" mt={8}>
                <AlertIcon />
                The creator requires every stake to be locked for at least {minDurationDays} days.
              </Alert>
            )}

            <Button
              mt={4}
              mb={4}
              py={'7'}
              width="full"
              colorScheme="whatsapp"
              onClick={() => {
                stake(amount)
                onClose()
              }}
            >
              <VStack spacing={'1'}>
                <Text>Stake now</Text>
                <Text fontSize={'xs'} opacity=".8">
                  {minDurationDays
                    ? `You will be able to unstake from ${stakeLockedUntil}`
                    : 'You will be able to unstake at any time'}
                </Text>
              </VStack>
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
