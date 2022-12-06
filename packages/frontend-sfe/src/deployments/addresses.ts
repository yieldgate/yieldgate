/**
 * Additional address (per chain-id)
 */

export enum AddressesKeys {
  USDC = 'USDC',
}

export type AddressType = `0x${string}`
export type AddressesType = { [_ in AddressesKeys]?: AddressType }
export type AllAddressesType = { [_ in AddressesKeys]: { [_: number]: AddressType } }

export const allAddresses: AllAddressesType = {
  [AddressesKeys.USDC]: {
    80001: '0x7ab4fCFCd4F108cdC43D591C0546aC7cfC36fd6B',
    137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  },
}

export const getAddressesFor = (chainId: number): AddressesType => {
  return Object.entries(allAddresses).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value[chainId],
    }),
    {}
  )
}
