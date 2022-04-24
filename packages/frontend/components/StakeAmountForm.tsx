import * as React from 'react'
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'

export interface StakeAmountFormProps {
  stake: (value: string) => void
  onClose: () => void
}
export default function StakeAmountForm({
  stake,
  onClose,
}: StakeAmountFormProps) {
  const [amount, setAmount] = React.useState('0.1')

  return (
    <>
      <FormControl mt={8}>
        <FormLabel htmlFor="amount">Staking amount in Matic</FormLabel>
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
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
