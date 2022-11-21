import { HardhatRuntimeEnvironment } from 'hardhat/types'

export type AddressValues = {
  aave: {
    poolAddressesProvider: string
    pool: string
    wETHGateway: string
    nativeAToken: string
  }
  toucan?: {
    offsetHelper: string
  }
  tokens: {
    usdc: string
    wmatic?: string
  }
}

export const Addresses: Record<
  number, // network name
  AddressValues
> = {
  // hardhat local node for unit tests
  1337: {
    aave: {
      poolAddressesProvider: '0x0000000000000000000000000000000000000000',
      pool: '0x0000000000000000000000000000000000000000',
      wETHGateway: '0x0000000000000000000000000000000000000000',
      nativeAToken: '0x0000000000000000000000000000000000000000',
    },
    toucan: {
      offsetHelper: '0x0000000000000000000000000000000000000000',
    },
    tokens: {
      usdc: '0x0000000000000000000000000000000000000000',
    },
  },
  // Goerli
  5: {
    aave: {
      poolAddressesProvider: '0xc4dCB5126a3AfEd129BC3668Ea19285A9f56D15D',
      pool: '0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6',
      wETHGateway: '0xd5B55D3Ed89FDa19124ceB5baB620328287b915d',
      nativeAToken: '0x27B4692C93959048833f40702b22FE3578E77759',
    },
    tokens: {
      usdc: '0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43',
    },
  },
  // Polygon Mumbai
  80001: {
    aave: {
      poolAddressesProvider: '0x5343b5bA672Ae99d627A1C87866b8E53F47Db2E6',
      pool: '0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B',
      wETHGateway: '0x2a58E9bbb5434FdA7FF78051a4B82cb0EF669C17',
      nativeAToken: '0x89a6AE840b3F8f489418933A220315eeA36d11fF',
    },
    toucan: {
      offsetHelper: '0x30dC279166DCFB69F52C91d6A3380dCa75D0fCa7',
    },
    tokens: {
      usdc: '0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2',
      wmatic: '0xb685400156cF3CBE8725958DeAA61436727A30c3',
    },
  },
}

export async function getAddresses(hre: HardhatRuntimeEnvironment): Promise<AddressValues> {
  const chainId = parseInt(await hre.getChainId())
  const addrs = Addresses[chainId]
  if (!addrs) {
    throw new Error(`No addresses for network ${chainId}`)
  }
  return addrs
}
