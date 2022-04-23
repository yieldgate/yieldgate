import {
  FormControl,
  NumberInputField,
  NumberInputStepper,
  NumberInput,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  FormLabel,
} from '@chakra-ui/react'

export default function StakeAmountForm() {
  return (
    <form>
      <FormControl mt={8}>
        <FormLabel htmlFor="amount">Staking amount in Matic</FormLabel>
        <NumberInput max={50} min={10}>
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
