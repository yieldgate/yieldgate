// SPDX-License-Identifier: MIT

import { BigNumber } from 'ethers'

const PREC = 10_000

export function withinRelRange(
  center: BigNumber,
  relPlusMinus: number
): (value: BigNumber) => boolean {
  return (value: BigNumber) => {
    if (relPlusMinus < 0 || relPlusMinus > 1) throw new Error('relPlusMinus not within [0,1]')

    const lbScaled = Math.round(PREC * (1 - relPlusMinus))
    const ubScaled = Math.round(PREC * (1 + relPlusMinus))
    const valScaled = value.mul(PREC)
    return center.mul(lbScaled).lte(valScaled) && center.mul(ubScaled).gte(valScaled)
  }
}
