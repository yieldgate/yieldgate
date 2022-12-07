// SPDX-License-Identifier: MIT

import { BigNumber } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Addresses } from '../shared/addresses'
import { parseUSDC } from '../shared/utils'

export type End2EndConfig = {
  token?: string
  whale?: string
  stake: BigNumber
  offsetToken: string
}

const End2EndConfigs: Record<number, End2EndConfig> = {
  // Local hardhat node
  1337: {
    stake: parseUSDC('1000000'), // 1 Mio
    offsetToken: Addresses[1337].toucan!.nct,
  },
  // Polygon Mumbai
  80001: {
    stake: parseUSDC('1000000'), // 1 Mio
    offsetToken: Addresses[80001].toucan!.nct,
  },
  // Polygon mainnet
  137: {
    token: Addresses[137].tokens.usdc,
    whale: '0xF977814e90dA44bFA03b6295A0616a897441aceC', // Binance hot wallet
    stake: parseUSDC('1000000'), // 1 Mio
    offsetToken: Addresses[137].toucan!.nct,
  },
}

export async function getEnd2endConfig(hre: HardhatRuntimeEnvironment): Promise<End2EndConfig> {
  const chainId = parseInt(await hre.getChainId())
  const cfg = End2EndConfigs[chainId]
  if (!cfg) {
    throw new Error(`No end2end config for network ${chainId}`)
  }
  return cfg
}
