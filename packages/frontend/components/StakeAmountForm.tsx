import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react'
import { useYieldgateContracts } from '@lib/useYieldgateContracts'
import * as React from 'react'

export interface StakeAmountFormProps {
  stake: (value: string) => void
  onClose: () => void
}
export default function StakeAmountForm({ stake, onClose }: StakeAmountFormProps) {
  const { contractsChain } = useYieldgateContracts()
  const [amount, setAmount] = React.useState('0.1')

  return (
    <>
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
    </>
  )
}
