//SPDX-License-Identifier: MIT

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import chai, { expect } from 'chai'
import hre from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { smock } from '@defi-wonderland/smock'

import { RevertReasons } from '../shared/revertReasons'
import {
  IERC20,
  IAavePool,
  IAavePoolAddressesProvider,
  TokenPool__factory,
} from '../typechain-types'

dayjs.extend(duration)
chai.use(smock.matchers)

const ethers = hre.ethers
const ZeroAddr = ethers.constants.AddressZero

describe('TokenPool', function () {
  async function deployTokenPool() {
    // Aave context setup
    const usdc = await smock.fake<IERC20>('IERC20')
    const aUsdc = await smock.fake<IERC20>('IERC20')
    const aavePool = await smock.fake<IAavePool>('IAavePool')
    // Get zero-initialized return value struct and modify field aTokenAddress
    const rd = { ...(await aavePool.getReserveData(ZeroAddr)) }
    rd.aTokenAddress = aUsdc.address
    aavePool.getReserveData.whenCalledWith(usdc.address).returns(rd)
    const aavePoolAP = await smock.fake<IAavePoolAddressesProvider>('IAavePoolAddressesProvider')
    aavePoolAP.getPool.returns(aavePool.address)

    // TokenPool setup
    const [admin, beneficiary, supporter] = await ethers.getSigners()
    const tokenPoolFactory = (await hre.ethers.getContractFactory(
      'TokenPool'
    )) as TokenPool__factory
    const pool = await tokenPoolFactory.deploy(aavePoolAP.address, beneficiary.address)

    return { admin, beneficiary, supporter, usdc, aUsdc, aavePool, aavePoolAP, pool }
  }

  it('Fixture should correctly deploy Aave context and TokenPool', async function () {
    const { beneficiary, usdc, aUsdc, aavePool, aavePoolAP, pool } = await loadFixture(
      deployTokenPool
    )

    expect(await pool.aavePoolAddressesProvider()).to.equal(aavePoolAP.address)
    expect(await pool.beneficiary()).to.equal(beneficiary.address)
    expect(await aavePoolAP.getPool()).to.equal(aavePool.address)
    const reserveData = await aavePool.getReserveData(usdc.address)
    expect(reserveData.aTokenAddress).to.equal(aUsdc.address)
  })

  it('AavePool approval should only work if approve call works', async function () {
    const { usdc, pool } = await loadFixture(deployTokenPool)
    usdc.approve.reset()

    // Failing case
    usdc.approve.returns(false)
    await expect(pool.approvePool(usdc.address)).to.be.revertedWith(
      RevertReasons.AavePoolApprovalFailed
    )

    // Success case
    usdc.approve.returns(true)
    await expect(pool.approvePool(usdc.address)).to.not.be.reverted
  })

  it('Staking with 0 amount should revert', async function () {
    const { supporter, usdc, pool } = await loadFixture(deployTokenPool)

    await expect(pool.connect(supporter).stake(usdc.address, supporter.address, 0)) //
      .to.be.revertedWith(RevertReasons.ZeroAmount)
  })

  it('Unstaking without any stake should revert', async function () {
    const { supporter, usdc, pool } = await loadFixture(deployTokenPool)

    await expect(pool.connect(supporter).unstake(usdc.address)) //
      .to.be.revertedWith(RevertReasons.NoSupporter)
  })

  it('Staking with failed transferFrom should revert', async function () {
    const { supporter, usdc, pool } = await loadFixture(deployTokenPool)
    const stake = ethers.utils.parseEther('1')

    usdc.transferFrom.reset()
    usdc.transferFrom.returns(false)
    await expect(pool.connect(supporter).stake(usdc.address, supporter.address, stake)) //
      .to.be.revertedWith(RevertReasons.TokenTransferFailed)

    expect(await pool.staked(usdc.address)).to.equal(0)
    expect(await pool.stakes(usdc.address, supporter.address)).to.equal(0)
  })

  it('Staking and unstaking by supporter should restore their balance', async function () {
    const { supporter, usdc, aavePool, pool } = await loadFixture(deployTokenPool)
    const poolAsSup = pool.connect(supporter)
    const stake = ethers.utils.parseEther('1')

    // 1. Stake

    usdc.transferFrom.reset()
    usdc.transferFrom.returns(false)
    usdc.transferFrom.whenCalledWith(supporter.address, pool.address, stake).returns(true)
    const stakeTx = await poolAsSup.stake(usdc.address, supporter.address, stake)
    await expect(stakeTx).to.emit(pool, 'Staked').withArgs(usdc.address, supporter.address, stake)
    // following would transfer token from supporter to TokenPool
    expect(usdc.transferFrom).to.be.calledWith(supporter.address, pool.address, stake)
    // following would transfer token from TokenPool to AavePool
    expect(aavePool.supply).to.be.calledWith(usdc.address, stake, pool.address, 0)

    expect(await pool.staked(usdc.address)).to.equal(stake)
    expect(await pool.stakes(usdc.address, supporter.address)).to.equal(stake)

    // 2. Unstake

    aavePool.withdraw.reset()
    aavePool.withdraw.reverts()
    aavePool.withdraw.whenCalledWith(usdc.address, stake, supporter.address).returns()

    await expect(poolAsSup.unstake(usdc.address))
      .to.emit(pool, 'Unstaked')
      .withArgs(usdc.address, supporter.address, stake)

    // following would transfer token from AavePool to TokenPool
    expect(aavePool.withdraw).to.be.calledWith(usdc.address, stake, supporter.address)
    expect(await pool.staked(usdc.address)).to.equal(0)
    expect(await pool.stakes(usdc.address, supporter.address)).to.equal(0)
  })

  it('Claiming should withdraw generated yield to beneficiary', async function () {
    const { beneficiary, supporter, usdc, aUsdc, aavePool, pool } = await loadFixture(
      deployTokenPool
    )
    const poolAsSup = pool.connect(supporter)
    const stake = ethers.utils.parseEther('1')
    const yld = ethers.utils.parseEther('.2')

    // stake
    usdc.transferFrom.reset()
    usdc.transferFrom.whenCalledWith(supporter.address, pool.address, stake).returns(true)
    await poolAsSup.stake(usdc.address, supporter.address, stake)

    // add yield to balance
    aUsdc.balanceOf.whenCalledWith(pool.address).returns(stake.add(yld))
    expect(await pool.staked(usdc.address)).to.equal(stake)
    expect(await pool.claimable(usdc.address)).to.equal(yld)

    // try clamining as supporter
    await expect(poolAsSup.claim(usdc.address)).to.be.revertedWith(RevertReasons.OnlyBeneficiary)

    // claim yield
    aavePool.withdraw.reset()
    aavePool.withdraw.reverts()
    aavePool.withdraw.whenCalledWith(usdc.address, yld, beneficiary.address).returns()

    await expect(pool.connect(beneficiary).claim(usdc.address))
      .to.emit(pool, 'Claimed')
      .withArgs(usdc.address, yld)
    expect(aavePool.withdraw).to.be.calledWith(usdc.address, yld, beneficiary.address)

    // remove yield from balance
    aUsdc.balanceOf.whenCalledWith(pool.address).returns(stake)
    expect(await pool.staked(usdc.address)).to.equal(stake)
    expect(await pool.claimable(usdc.address)).to.equal(0)
  })
})
