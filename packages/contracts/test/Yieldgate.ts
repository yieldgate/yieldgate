//SPDX-License-Identifier: MIT

import { expect } from 'chai'
import hre from 'hardhat'

import { YieldGate__factory } from '../typechain-types'

const ZeroAddr = hre.ethers.constants.AddressZero

describe('YieldGate', function () {
  // TODO setup mocks
  const aavePool = ZeroAddr
  const wETHGateway = ZeroAddr
  const aWETH = ZeroAddr

  it('Should deploy YieldGate', async function () {
    const yieldgateFactory = (await hre.ethers.getContractFactory(
      'YieldGate'
    )) as YieldGate__factory
    const yieldgate = await yieldgateFactory.deploy(aavePool, wETHGateway, aWETH)
    expect(yieldgate.address).to.be.a.properAddress
    expect(yieldgate.address).to.not.equal(ZeroAddr)
  })
})
