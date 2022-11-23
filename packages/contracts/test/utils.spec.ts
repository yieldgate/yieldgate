// SPDX-License-Identifier: MIT

import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { withinRelRange } from './utils'

describe('withinRelRange()', function () {
  const ZERO = BigNumber.from(0)

  it('should throw error when relPlusMinus < 0', function () {
    expect(() => {
      withinRelRange(ZERO, -0.01)(ZERO)
    }).to.throw()
  })

  it('should throw error when relPlusMinus > 1', function () {
    expect(() => {
      withinRelRange(ZERO, 1.01)(ZERO)
    }).to.throw()
  })

  const C = BigNumber.from(1_000_000)

  for (const t of [
    {
      relPlusMinus: 0,
      value: C,
      res: true,
    },
    {
      relPlusMinus: 0,
      value: C.add(1),
      res: false,
    },
    {
      relPlusMinus: 0.01,
      value: C.add(10_000),
      res: true,
    },
    {
      relPlusMinus: 0.01,
      value: C.sub(10_000),
      res: true,
    },
    {
      relPlusMinus: 0.01,
      value: C.add(10_001),
      res: false,
    },
    {
      relPlusMinus: 0.01,
      value: C.sub(10_001),
      res: false,
    },
    {
      relPlusMinus: 1,
      value: C.mul(2),
      res: true,
    },
    {
      relPlusMinus: 1,
      value: ZERO,
      res: true,
    },
    {
      relPlusMinus: 1,
      value: C.mul(2).add(1),
      res: false,
    },
    {
      relPlusMinus: 1,
      value: BigNumber.from(-1),
      res: false,
    },
  ]) {
    it(`${t.value} within ${C}±r${t.relPlusMinus} should be ${t.res}`, function () {
      expect(withinRelRange(C, t.relPlusMinus)(t.value)).to.equal(t.res)
    })
  }
})
