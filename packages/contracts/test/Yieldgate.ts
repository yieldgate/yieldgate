//SPDX-License-Identifier: MIT

import chai, { expect } from 'chai'
import hre from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { smock } from '@defi-wonderland/smock'

import {
  IERC20,
  IWETHGateway,
  YieldGate__factory,
  BeneficiaryPool__factory,
} from '../typechain-types'

chai.use(smock.matchers)

const ethers = hre.ethers
const ZeroAddr = ethers.constants.AddressZero

describe('YieldGate', function () {
  const aavePool = '0x000000000000000000000000000000000000bEEF' // passed to wETHGateway

  async function deployYieldGateAndOnePool() {
    const wETHGateway = await smock.fake<IWETHGateway>('IWETHGateway')
    expect(wETHGateway.address).to.be.a.properAddress
    expect(wETHGateway.address).to.not.equal(ZeroAddr)
    const aWETH = await smock.fake<IERC20>('IERC20')
    expect(aWETH.address).to.be.a.properAddress
    expect(aWETH.address).to.not.equal(ZeroAddr)

    const yieldgateFactory = (await hre.ethers.getContractFactory(
      'YieldGate'
    )) as YieldGate__factory
    const yieldgate = await yieldgateFactory.deploy(aavePool, wETHGateway.address, aWETH.address)
    expect(yieldgate.address).to.not.equal(ZeroAddr)
    expect(await yieldgate.aavePool()).to.equal(aavePool)
    expect(await yieldgate.wethgw()).to.equal(wETHGateway.address)
    expect(await yieldgate.token()).to.equal(aWETH.address)

    const [admin, beneficiary, supporter] = await ethers.getSigners()
    const deployPoolTx = await yieldgate.deployPool(beneficiary.address)
    let poolAddr = ZeroAddr
    await expect(deployPoolTx)
      .to.emit(yieldgate, 'PoolDeployed')
      .withArgs(beneficiary.address, admin.address, (a: string) => {
        // capture pool address from event
        poolAddr = a
        return true
      })
    // sanity check
    const pool1 = await yieldgate.beneficiaryPools(beneficiary.address)
    expect(pool1).to.be.equal(poolAddr)

    const pool = BeneficiaryPool__factory.connect(poolAddr, beneficiary)

    return { wETHGateway, aWETH, yieldgate, beneficiary, pool, supporter }
  }

  it('Fixture should deploy YieldGate and one BeneficiaryPool', async function () {
    const { wETHGateway, aWETH, yieldgate, beneficiary, pool } = await loadFixture(
      deployYieldGateAndOnePool
    )

    expect(await yieldgate.wethgw()).to.equal(wETHGateway.address)
    expect(await yieldgate.aavePool()).to.equal(aavePool)
    expect(await yieldgate.token()).to.equal(aWETH.address)
    expect(await pool.gate()).to.equal(yieldgate.address)
    expect(await pool.beneficiary()).to.equal(beneficiary.address)
  })

  it('YieldGate views on non-existent pools should return 0', async function () {
    const { yieldgate, supporter } = await loadFixture(deployYieldGateAndOnePool)
    const a = supporter.address // just any address without a pool

    expect(await yieldgate.claimable(a)).to.equal(0)
    expect(await yieldgate.staked(a)).to.equal(0)
    expect(await yieldgate.supporterStaked(a, a)).to.equal(0)
  })

  it('Second initialization of pool should revert', async function () {
    const { yieldgate, beneficiary, pool } = await loadFixture(deployYieldGateAndOnePool)

    await expect(pool.init(yieldgate.address, beneficiary.address)).to.be.revertedWith(
      'already initialized'
    )
  })

  it('Staking and unstaking by supporter should restore their balance', async function () {
    const { wETHGateway, aWETH, yieldgate, beneficiary, pool, supporter } = await loadFixture(
      deployYieldGateAndOnePool
    )

    const poolAsSup = pool.connect(supporter)
    const stake = ethers.utils.parseEther('1')

    // 1. Stake

    const stakeTx = await poolAsSup.stake(supporter.address, { value: stake })
    await expect(stakeTx)
      .to.emit(pool, 'Staked')
      .withArgs(beneficiary.address, supporter.address, stake)
    await expect(stakeTx).to.changeEtherBalances(
      [supporter.address, wETHGateway.address],
      [stake.mul(-1), stake]
    )
    expect(wETHGateway.depositETH).to.be.calledWith(aavePool, pool.address, 0)

    expect(await yieldgate.staked(beneficiary.address)).to.equal(stake)
    expect(await yieldgate.supporterStaked(supporter.address, beneficiary.address)).to.equal(stake)
    expect(await pool.supporters(supporter.address)).to.equal(stake)
    expect(await pool.staked()).to.equal(stake)

    // 2. Unstake

    aWETH.approve.whenCalledWith(wETHGateway.address, stake).returns(true)
    // TODO: smock cannot send ether yet, so wethGateway fake cannot send the
    // stake back at the moment.

    await expect(poolAsSup.unstake())
      .to.emit(pool, 'Unstaked')
      .withArgs(beneficiary.address, supporter.address, stake)
    expect(wETHGateway.withdrawETH).to.be.calledWith(aavePool, stake, supporter.address)
    expect(await pool.supporters(supporter.address)).to.equal(0)
    // TODO: assert changed ether balances when fake is able to.

    await expect(poolAsSup.unstake()).to.be.revertedWith('no supporter')
  })

  it('Generated yield should be claimable by beneficiary', async function () {
    const { wETHGateway, aWETH, yieldgate, beneficiary, pool, supporter } = await loadFixture(
      deployYieldGateAndOnePool
    )

    const stake = ethers.utils.parseEther('1')
    const yld = ethers.utils.parseEther('.2')

    // stake
    await pool.connect(supporter).stake(supporter.address, { value: stake })

    // add yield to balance
    aWETH.balanceOf.whenCalledWith(pool.address).returns(stake.add(yld))
    expect(await pool.staked()).to.equal(stake)
    expect(await pool.claimable()).to.equal(yld)
    expect(await yieldgate.claimable(beneficiary.address)).to.equal(yld)

    // try clamining as supporter
    await expect(pool.connect(supporter).claim()).to.be.revertedWith('only beneficiary')

    // claim yield
    aWETH.approve.whenCalledWith(wETHGateway.address, yld).returns(true)
    await expect(pool.claim()).to.emit(pool, 'Claimed').withArgs(beneficiary.address, yld)
    expect(wETHGateway.withdrawETH).to.be.calledWith(aavePool, yld, beneficiary.address)

    // remove yield from balance
    aWETH.balanceOf.whenCalledWith(pool.address).returns(stake)
    expect(await pool.staked()).to.equal(stake)
    expect(await pool.claimable()).to.equal(0)
  })
})