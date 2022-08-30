import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
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
import { SupporterStake } from '@lib/creatorReadHooks'
import { useDeployments } from '@lib/useDeployments'
import dayjs from 'dayjs'
import { FC, useEffect, useRef, useState } from 'react'

export interface SupporterStakeDialogProps {
  isOpen: boolean
  onClose: () => void
  stake: (_: string) => void
  minAmount?: string
  minDurationDays?: number
  supporterStake?: SupporterStake | undefined
}
export const SupporterStakeDialog: FC<SupporterStakeDialogProps> = ({
  isOpen,
  onClose,
  stake,
  minAmount,
  minDurationDays,
  supporterStake,
}) => {
  const initialRef = useRef(null)
  const { contractsChain } = useDeployments()
  const [amount, setAmount] = useState<string>()
  const stakeLockedUntil = dayjs()
    .add(minDurationDays || 0, 'days')
    .format('YYYY/MM/DD')
  const [formIsInvalid, setFormIsInvalid] = useState(false)

  useEffect(() => {
    setFormIsInvalid(
      !amount ||
        parseFloat(amount) <= 0 ||
        (!!minAmount && parseFloat(amount) < parseFloat(minAmount))
    )
  }, [minAmount, amount, supporterStake?.amount])

  useEffect(() => {
    setAmount(`${minAmount}` || '0.01')
  }, [minAmount])

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
            <FormControl mt={8} mb={4} isInvalid={formIsInvalid}>
              <FormLabel htmlFor="amount">Amount to stake</FormLabel>
              <InputGroup size="sm">
                <Input
                  type="number"
                  value={amount ?? minAmount}
                  onChange={({ target: { value } }) => setAmount(value)}
                  ref={initialRef}
                />
                <InputRightAddon>{contractsChain?.nativeCurrency?.symbol}</InputRightAddon>
              </InputGroup>
              {formIsInvalid && (
                <FormErrorMessage>
                  {!amount || parseFloat(amount) <= 0
                    ? 'Staking amount needs to be a positive number'
                    : `Minimum staking amount is ${minAmount} ${contractsChain?.nativeCurrency?.symbol}`}
                </FormErrorMessage>
              )}
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
              disabled={formIsInvalid}
              colorScheme="whatsapp"
              onClick={() => {
                if (!amount) return
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
