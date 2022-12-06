import { BigNumber, utils } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Addresses } from '../shared/addresses'

export function parseUSDC(s: string): BigNumber {
  return utils.parseUnits(s, 6)
}

export type End2EndConfig = {
  token: string
  whale: string
  stake: BigNumber
  offsetToken: string
}

const End2EndConfigs: Record<number, End2EndConfig> = {
  // Polygon Mumbai
  80001: {
    token: Addresses[80001].tokens.usdc,
    whale: '0xc945a5a960fef1a9c3fef8593fc2446d1d7c6146',
    stake: parseUSDC('1000000'), // 1 Mio
    //token: Addresses[80001].tokens.wmatic!,
    //whale: '0xc945a5a960fef1a9c3fef8593fc2446d1d7c6146',
    //stake: utils.parseEther('10000'), // 10k
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
