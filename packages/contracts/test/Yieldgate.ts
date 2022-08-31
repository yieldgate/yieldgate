//SPDX-License-Identifier: MIT

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import chai, { expect } from 'chai'
import hre from 'hardhat'
import { loadFixture, time as chaintime } from '@nomicfoundation/hardhat-network-helpers'
import { smock } from '@defi-wonderland/smock'
import { TransactionResponse } from '@ethersproject/providers'

import { RevertReasons } from '../shared/revertReasons'
import {
  IERC20,
  IWETHGateway,
  YieldGate__factory,
  BeneficiaryPool__factory,
} from '../typechain-types'

dayjs.extend(duration)
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

    await expect(deployPoolTx)
      .to.emit(pool, 'ParametersChanged')
      .withArgs(beneficiary.address, 0, 0)

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
    expect(await yieldgate.supporterStaked(a, a)).to.deep.equal([0, 0])
  })

  it('Second initialization of pool should revert', async function () {
    const { yieldgate, beneficiary, pool } = await loadFixture(deployYieldGateAndOnePool)

    await expect(pool.init(yieldgate.address, beneficiary.address)).to.be.revertedWith(
      RevertReasons.AlreadyInitialized
    )
  })

  it('Setting pool parameters should set them and emit ParametersChanged events', async function () {
    const { beneficiary, pool } = await loadFixture(deployYieldGateAndOnePool)

    // setMinAmount
    let minAmount = 1_000_000_000_000
    await expect(pool.setMinAmount(minAmount))
      .to.emit(pool, 'ParametersChanged')
      .withArgs(beneficiary.address, minAmount, 0)
    expect(await pool.minAmount()).to.equal(minAmount)
    expect(await pool.minDuration()).to.equal(0)

    // setMinDuration
    let minDuration = dayjs.duration(10, 'days').asSeconds()
    await expect(pool.setMinDuration(minDuration))
      .to.emit(pool, 'ParametersChanged')
      .withArgs(beneficiary.address, minAmount, minDuration)
    expect(await pool.minAmount()).to.equal(minAmount)
    expect(await pool.minDuration()).to.equal(minDuration)

    // setParameters
    minAmount *= 2
    minDuration *= 5
    await expect(pool.setParameters(minAmount, minDuration))
      .to.emit(pool, 'ParametersChanged')
      .withArgs(beneficiary.address, minAmount, minDuration)
    expect(await pool.minAmount()).to.equal(minAmount)
    expect(await pool.minDuration()).to.equal(minDuration)
  })

  it('Trying to set pool parameters as non-beneficiary should revert', async function () {
    const { pool, supporter } = await loadFixture(deployYieldGateAndOnePool)
    const minAmount = 1_000_000_000_000
    const minDuration = dayjs.duration(10, 'days').asSeconds()
    const poolAsOther = pool.connect(supporter) // anyone else

    await expect(poolAsOther.setMinAmount(minAmount)).to.be.revertedWith(
      RevertReasons.OnlyBeneficiary
    )
    await expect(poolAsOther.setMinDuration(minDuration)).to.be.revertedWith(
      RevertReasons.OnlyBeneficiary
    )
    await expect(poolAsOther.setParameters(minAmount, minDuration)).to.be.revertedWith(
      RevertReasons.OnlyBeneficiary
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
      .withArgs(beneficiary.address, supporter.address, stake, 0)
    await expect(stakeTx).to.changeEtherBalances(
      [supporter.address, wETHGateway.address],
      [stake.mul(-1), stake]
    )
    expect(wETHGateway.depositETH).to.be.calledWith(aavePool, pool.address, 0)

    expect(await yieldgate.staked(beneficiary.address)).to.equal(stake)
    expect(await yieldgate.supporterStaked(supporter.address, beneficiary.address)) //
      .to.deep.equal([stake, 0])
    expect(await pool.stakes(supporter.address)).to.equal(stake)
    expect(await pool.staked()).to.equal(stake)

    // 2. Unstake

    aWETH.approve.whenCalledWith(wETHGateway.address, stake).returns(true)
    // TODO: smock cannot send ether yet, so wethGateway fake cannot send the
    // stake back at the moment.

    await expect(poolAsSup.unstake())
      .to.emit(pool, 'Unstaked')
      .withArgs(beneficiary.address, supporter.address, stake)
    expect(wETHGateway.withdrawETH).to.be.calledWith(aavePool, stake, supporter.address)
    expect(await pool.stakes(supporter.address)).to.equal(0)
    // TODO: assert changed ether balances when fake is able to.

    await expect(poolAsSup.unstake()).to.be.revertedWith(RevertReasons.NoSupporter)
  })

  it('Staking with amount of 0 should revert', async function () {
    const { pool, supporter } = await loadFixture(deployYieldGateAndOnePool)

    await expect(pool.connect(supporter).stake(supporter.address, { value: 0 })) //
      .to.be.revertedWith(RevertReasons.AmountTooLow)
  })

  it('Staking below minimum should revert, above work', async function () {
    const { pool, supporter } = await loadFixture(deployYieldGateAndOnePool)

    const minStake = ethers.utils.parseEther('10')
    await pool.setMinAmount(minStake)

    let stake = ethers.utils.parseEther('5')
    const poolAsSup = pool.connect(supporter)
    await expect(poolAsSup.stake(supporter.address, { value: stake })) //
      .to.be.revertedWith(RevertReasons.AmountTooLow)
    stake = stake.mul(3) // 15 ether
    await expect(poolAsSup.stake(supporter.address, { value: stake })) //
      .to.emit(pool, 'Staked')
  })

  it('Unstaking before lock timeout should revert, after work', async function () {
    const { aWETH, wETHGateway, beneficiary, pool, supporter } = await loadFixture(
      deployYieldGateAndOnePool
    )

    const minDuration = dayjs.duration(30, 'days')
    await pool.setMinDuration(minDuration.asSeconds())

    // Staking

    const stake = ethers.utils.parseEther('1')
    const poolAsSup = pool.connect(supporter)
    const stakeTx = await poolAsSup.stake(supporter.address, { value: stake })
    const stakeTs = await getTxTimestamp(stakeTx)
    const lockTimeout = stakeTs + minDuration.asSeconds()
    await expect(stakeTx)
      .to.emit(pool, 'Staked')
      .withArgs(beneficiary.address, supporter.address, stake, lockTimeout)

    // Unstaking

    // approve already to make sure this is not the revert reason
    aWETH.approve.whenCalledWith(wETHGateway.address, stake).returns(true)

    // advance just close to the lock timeout
    await chaintime.increase(minDuration.subtract(1, 'minute').asSeconds())
    await expect(poolAsSup.unstake()).to.be.revertedWith(RevertReasons.StakeStillLocked)

    // advance just past timeout
    await chaintime.increase(60)
    await expect(poolAsSup.unstake()).to.emit(pool, 'Unstaked')
  })

  it('After setting params, topping up stake below minimum should revert, above work and reset timeout', async function () {
    const { beneficiary, pool, supporter } = await loadFixture(deployYieldGateAndOnePool)

    // Stake on pool with 0 parameters

    const stake0 = ethers.utils.parseEther('5')
    const poolAsSup = pool.connect(supporter)
    await expect(poolAsSup.stake(supporter.address, { value: stake0 })) //
      .to.emit(pool, 'Staked')
      .withArgs(beneficiary.address, supporter.address, stake0, 0)

    // Set parameters after first staking

    const minStake = ethers.utils.parseEther('10')
    const minDuration = dayjs.duration(420, 'days').asSeconds()
    await pool.setParameters(minStake, minDuration)

    // Topup

    const reqStake = minStake.sub(stake0)
    // just too low
    await expect(poolAsSup.stake(supporter.address, { value: reqStake.sub(1) })) //
      .to.be.revertedWith(RevertReasons.AmountTooLow)
    // just enough
    const topupTx = await poolAsSup.stake(supporter.address, { value: reqStake })
    const topupTs = await getTxTimestamp(topupTx)
    const lockTimeout = topupTs + minDuration
    await expect(topupTx)
      .to.emit(pool, 'Staked')
      .withArgs(beneficiary.address, supporter.address, reqStake, lockTimeout)
    expect(await pool.stakes(supporter.address)).to.equal(minStake)
  })

  it('Resetting min. duration to zero should effectively lift existing locks', async function () {
    const { aWETH, wETHGateway, pool, supporter } = await loadFixture(deployYieldGateAndOnePool)

    // Stake on pool with some min. duration
    const minDuration = dayjs.duration(420, 'days').asSeconds()
    await pool.setMinDuration(minDuration)
    const stake = ethers.utils.parseEther('1')
    const poolAsSup = pool.connect(supporter)
    await expect(poolAsSup.stake(supporter.address, { value: stake })).to.emit(pool, 'Staked')

    // Reset min. duration to 0 and unstake
    await pool.setMinDuration(0)
    expect(await pool.lockTimeout(supporter.address)).to.equal(0)
    aWETH.approve.whenCalledWith(wETHGateway.address, stake).returns(true)
    await expect(poolAsSup.unstake()).to.emit(pool, 'Unstaked')
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
    await expect(pool.connect(supporter).claim()).to.be.revertedWith(RevertReasons.OnlyBeneficiary)

    // claim yield
    aWETH.approve.whenCalledWith(wETHGateway.address, yld).returns(true)
    await expect(pool.claim()).to.emit(pool, 'Claimed').withArgs(beneficiary.address, yld)
    expect(wETHGateway.withdrawETH).to.be.calledWith(aavePool, yld, beneficiary.address)

    // remove yield from balance
    aWETH.balanceOf.whenCalledWith(pool.address).returns(stake)
    expect(await pool.staked()).to.equal(stake)
    expect(await pool.claimable()).to.equal(0)
  })

  it('Valid unstaking with misbehaving aWETH should revert', async function () {
    const { aWETH, wETHGateway, pool, supporter } = await loadFixture(deployYieldGateAndOnePool)

    const stake = ethers.utils.parseEther('1')
    const poolAsSup = pool.connect(supporter)
    await expect(poolAsSup.stake(supporter.address, { value: stake })).to.emit(pool, 'Staked')

    aWETH.approve.whenCalledWith(wETHGateway.address, stake).returns(false)
    await expect(poolAsSup.unstake()).to.be.revertedWith(RevertReasons.wethgwApprovalFailed)
  })
})

async function getTxTimestamp(tx: TransactionResponse): Promise<number> {
  const rec = await tx.wait()
  return (await ethers.provider.getBlock(rec.blockHash)).timestamp
}
