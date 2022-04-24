import {
  Button, FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField,
  NumberInputStepper
} from '@chakra-ui/react'

export interface StakeAmountFormProps {
  stake: (value: string) => void
}
export default function StakeAmountForm({stake}: StakeAmountFormProps) {
  return (
    <form>
      <FormControl mt={8}>
        <FormLabel htmlFor="amount">Staking amount in Matic</FormLabel>
        <NumberInput>
          <NumberInputField id="amount" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <Button my={8} width="full" bg="gray.900" color="gray.100">
        Stake now
      </Button>
    </form>
  )
}
