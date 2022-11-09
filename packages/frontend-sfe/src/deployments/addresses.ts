/**
 * Additional address constants (per chain-id)
 */

export enum AddressesKeys {
  USDC = 'USDC',
}

export type AddressType = `0x${string}`
export type AddressesType = { [_ in AddressesKeys]?: AddressType }
export type AllAddressesType = { [_ in AddressesKeys]: { [_: number]: AddressType } }

export const addresses: AllAddressesType = {
  [AddressesKeys.USDC]: {
    // TODO Replace with actual USDC address
    80001: '0xb685400156cf3cbe8725958deaa61436727a30c3',
  },
}

export const getAddressesFor = (chainId: number): AddressesType => {
  return Object.entries(addresses).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value[chainId],
    }),
    {}
  )
}
