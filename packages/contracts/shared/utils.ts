import { BigNumber, utils } from 'ethers'

export function parseUSDC(s: string): BigNumber {
  return utils.parseUnits(s, 6)
}
