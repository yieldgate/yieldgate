import { ContractAddresses_1337 } from './1337'
import { ContractAddresses_4 } from './4'
import { ContractAddresses_80001 } from './80001'
export const ContractAddresses = {
  '1337': ContractAddresses_1337,
  '4': ContractAddresses_4,
  '80001': ContractAddresses_80001,
}
export type ContractAddressesKey = keyof typeof ContractAddresses
