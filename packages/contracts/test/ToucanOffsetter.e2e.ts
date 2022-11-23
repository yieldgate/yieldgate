// SPDX-License-Identifier: MIT

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { expect } from 'chai'
import hre from 'hardhat'
import {
  impersonateAccount,
  loadFixture,
  time as ethtime,
} from '@nomicfoundation/hardhat-network-helpers'

import { getAddresses } from '../shared/addresses'
import { getDeploymentConfig } from '../shared/deploy'
import {
  IAavePoolAddressesProvider__factory,
  IERC20Metadata__factory,
  TokenPool__factory,
  ToucanOffsetter__factory,
  IToucanOffsetHelper__factory,
} from '../typechain-types'
import { getEnd2endConfig } from './end2end-config'
import { withinRelRange } from './utils'

dayjs.extend(duration)

const ethers = hre.ethers
const MaxUint256 = ethers.constants.MaxUint256

describe('ToucanOffsetter@e2e', function () {
  this.bail(true) // fail on first error, related steps

  // End2end tests should only run on forked real networks
  before(async function () {
    if (!(hre.network.name === 'hardhat' && 'forking' in hre.network.config)) this.skip()
  })

  async function deployToucanOffsetter() {
    const { deployer, offsetter } = await ethers.getNamedSigners()
    const depls = await hre.deployments.fixture(['ToucanOffsetter', 'TokenPool'])

    const toucanOffsetter = ToucanOffsetter__factory.connect(
      depls.ToucanOffsetter.address,
      deployer
    )

    const e2e = await getEnd2endConfig(hre)
    await impersonateAccount(e2e.whale)
    const staker = await ethers.getSigner(e2e.whale)
    const token = IERC20Metadata__factory.connect(e2e.token, staker)
    const tokenPool = TokenPool__factory.connect(depls.TokenPoolWithApproval.address, staker)
    const stake = e2e.stake
    const offsetToken = e2e.offsetToken

    return {
      deployer,
      staker,
      offsetter,
      token,
      toucanOffsetter,
      tokenPool,
      stake,
      offsetToken,
    }
  }

  it('Fixture should correctly deploy ToucanOffsetter with its TokenPool', async function () {
    const { deployer, toucanOffsetter, tokenPool } = await loadFixture(deployToucanOffsetter)

    const adminRole = await toucanOffsetter.DEFAULT_ADMIN_ROLE()

    // ToucanOffsetter
    expect(await toucanOffsetter.hasRole(adminRole, deployer.address)).to.be.true
    expect(await toucanOffsetter.pool()).to.equal(tokenPool.address)

    // TokenPool
    const { aave } = await getAddresses(hre)
    expect(await tokenPool.beneficiary()).to.be.equal(toucanOffsetter.address)
    expect(await tokenPool.aavePoolAddressesProvider()).to.be.equal(aave.poolAddressesProvider)
  })

  it('Fixture TokenPool deployment should set AavePool approvals', async function () {
    const { aave } = await getAddresses(hre)
    if (aave.poolAddressesProvider === ethers.constants.AddressZero) {
      this.skip()
    }

    const { deployer, tokenPool, token } = await loadFixture(deployToucanOffsetter)
    const aavePoolAP = IAavePoolAddressesProvider__factory.connect(
      aave.poolAddressesProvider,
      deployer
    )
    const aavePoolAddr = await aavePoolAP.getPool()
    const deplCfg = await getDeploymentConfig(hre)
    // Check that AavePool token allowances have been set
    for (const tokenAddr of deplCfg.tokenPool.tokenApprovals) {
      const token = IERC20Metadata__factory.connect(tokenAddr, deployer)
      const tokenName = await token.name()
      console.log(`Checking allowance for token ${tokenName}`)
      expect(await token.allowance(tokenPool.address, aavePoolAddr)).to.equal(
        MaxUint256, // max allowance
        `AavePool max. allowance for token ${tokenName}`
      )
    }
    expect(deplCfg.tokenPool.tokenApprovals).to.include(token.address)
  })

  it('Fixture should have staker with enough token', async function () {
    const { token, staker, stake } = await loadFixture(deployToucanOffsetter)
    expect(await token.balanceOf(staker.address)).to.be.greaterThan(stake)
  })

  it('Stake, wait, then offset', async function () {
    const { staker, offsetter, token, toucanOffsetter, tokenPool, stake, offsetToken } =
      await loadFixture(deployToucanOffsetter)

    await expect(token.approve(tokenPool.address, MaxUint256))
      .to.emit(token, 'Approval')
      .withArgs(staker.address, tokenPool.address, MaxUint256)
    await expect(tokenPool.stake(token.address, staker.address, stake)) //
      .to.emit(tokenPool, 'Staked')
      .withArgs(token.address, staker.address, stake)

    // advance blockchain by one month
    await ethtime.increase(dayjs.duration(1, 'month').asSeconds())

    const expYield = await tokenPool.claimable(token.address)
    console.log(`Claimable: ${expYield}`)
    expect(expYield).to.be.greaterThan(0)
    const expOffset = await IToucanOffsetHelper__factory.connect(
      await toucanOffsetter.offsetHelper(),
      staker
    ).calculateExpectedPoolTokenForToken(token.address, expYield, offsetToken)
    expect(expOffset).to.be.greaterThan(0)
    console.log(`Exp. offset: ${ethers.utils.formatEther(expOffset)}`)

    await toucanOffsetter.grantRole(toucanOffsetter.OFFSET_ROLE(), offsetter.address)
    const offsetterAsOfs = toucanOffsetter.connect(offsetter)
    await expect(offsetterAsOfs.offsetYield(token.address, offsetToken)) //
      .to.emit(toucanOffsetter, 'Offset')
      .withArgs(
        token.address,
        withinRelRange(expYield, 0.01), // ±1%
        offsetToken,
        withinRelRange(expOffset, 0.01) // ±1%
      )
  })
})
