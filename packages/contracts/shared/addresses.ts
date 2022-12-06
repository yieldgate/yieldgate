// SPDX-License-Identifier: MIT

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import isPlainObject from 'lodash.isplainobject'

export type AddressValues = {
  aave: {
    poolAddressesProvider: string
    pool: string
    wETHGateway: string
    nativeAToken: string
  }
  toucan?: {
    offsetHelper: string
    nct: string
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
      poolAddressesProvider: 'deployment:AaveMock',
      pool: 'deployment:AaveMock',
      wETHGateway: '0x0000000000000000000000000000000000000000',
      nativeAToken: 'deployment:AaveMock',
    },
    toucan: {
      offsetHelper: 'deployment:OffsetHelperMock',
      nct: '0x0000000000000000000000000000000000000042',
    },
    tokens: {
      usdc: 'deployment:SFETestUSD',
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
  // Polygon mainnet
  137: {
    aave: {
      poolAddressesProvider: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
      pool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      wETHGateway: '0x1e4b7A6b903680eab0c5dAbcb8fD429cD2a9598c',
      nativeAToken: '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8',
    },
    toucan: {
      offsetHelper: '0x9e0ACA6ABd7498d6EFcDcb5E3e736DbB6487458c',
      nct: '0xD838290e877E0188a4A44700463419ED96c16107',
    },
    tokens: {
      usdc: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      wmatic: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    },
  },
  // Polygon Mumbai
  80001: {
    aave: {
      poolAddressesProvider: 'deployment:AaveMock',
      pool: 'deployment:AaveMock',
      wETHGateway: '0x2a58E9bbb5434FdA7FF78051a4B82cb0EF669C17',
      nativeAToken: 'deployment:AaveMock',
    },
    toucan: {
      offsetHelper: 'deployment:OffsetHelperMock',
      nct: '0x7beCBA11618Ca63Ead5605DE235f6dD3b25c530E',
    },
    tokens: {
      usdc: 'deployment:SFETestUSD',
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
  return populateDeploymentAddresses(hre, addrs)
}

export async function populateDeploymentAddresses(
  hre: HardhatRuntimeEnvironment,
  obj: any
): Promise<any> {
  return mapDeepStringValuesAsync(obj, async (addr: string) => {
    if (!addr.startsWith('deployment:')) {
      return addr
    }
    const [, deplName] = addr.split(':')
    try {
      const { address } = await hre.deployments.get(deplName)
      return address ? address : '0x0000000000000000000000000000000000000000'
    } catch {
      return '0x0000000000000000000000000000000000000000'
    }
  })
}

async function mapDeepStringValuesAsync(
  obj: any,
  func: (s: string) => Promise<string>
): Promise<any> {
  if (isPlainObject(obj)) {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(obj).map(async ([key, value]) => {
          return [key, await mapDeepStringValuesAsync(value, func)]
        })
      )
    )
  } else if (typeof obj === 'object' && Array.isArray(obj)) {
    return Promise.all(obj.map((value) => mapDeepStringValuesAsync(value, func)))
  } else if (typeof obj == 'string') {
    return func(obj)
  }
  return obj
}
