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
  useToast,
} from '@chakra-ui/react'
import { useDeployments } from '@lib/useDeployments'
import { BeneficiaryPool__factory } from '@yieldgate/contracts/typechain-types'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { ethers } from 'ethers'
import { FC, useRef, useState } from 'react'
import { useSigner } from 'wagmi'
dayjs.extend(duration)

export interface CreatorPoolParamsDialogProps {
  isOpen: boolean
  onClose: () => void
  poolAddress?: string | false
  minAmount?: string
  minDurationDays?: number
  refetchPoolParams: () => void
}
export const CreatorPoolParamsDialog: FC<CreatorPoolParamsDialogProps> = ({
  isOpen,
  onClose,
  poolAddress,
  minAmount: fetchedMinAmount,
  minDurationDays: fetchedMinDurationDays,
  refetchPoolParams,
}) => {
  const initialRef = useRef(null)
  const { data: signer, refetch: refetchSigner } = useSigner()
  const { contracts, contractsChain } = useDeployments()
  const [minAmount, setMinAmount] = useState<string>()
  const [minDurationDays, setMinDurationDays] = useState<number>()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const updatePoolParameters = async () => {
    await refetchSigner()
    if (!poolAddress || !contracts || !signer) return
    setIsLoading(true)

    try {
      const poolContract = BeneficiaryPool__factory.connect(poolAddress, signer)
      const minDurationDaysDayjs = dayjs.duration(
        minDurationDays ?? Math.floor(fetchedMinDurationDays || 0),
        'days'
      )
      const minDurationSeconds = minDurationDaysDayjs.asSeconds()
      const transaction = await poolContract.setParameters(
        ethers.utils.parseEther(`${minAmount ?? fetchedMinAmount ?? '0.0'}`),
        minDurationSeconds,
        {
          gasLimit: 100000,
        }
      )
      console.log({ transaction })
      const receipt = await transaction.wait()
      console.log({ receipt })
    } catch (e) {
      console.error('Error while updating Pool Parameters:', e)
      toast({ title: 'Error while updating Pool Parameters. Try again.', status: 'error' })
      setIsLoading(false)
      return
    }

    toast({
      title: 'Successfully updated Pool Parameters',
      status: 'success',
    })
    setIsLoading(false)
    refetchPoolParams()
    onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          !isLoading && onClose()
        }}
        initialFocusRef={initialRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Pool Parameters</ModalHeader>
          <ModalCloseButton disabled={isLoading} />
          <ModalBody>
            <Text>Change the minimum staking amount and duration of your pool.</Text>
            <FormControl mt={8}>
              <FormLabel htmlFor="amount">Minimum Amount</FormLabel>
              <InputGroup size="sm">
                <Input
                  value={minAmount ?? fetchedMinAmount ?? '0.0'}
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
                  value={minDurationDays ?? Math.floor(fetchedMinDurationDays || 0)}
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
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Save Parameters
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
