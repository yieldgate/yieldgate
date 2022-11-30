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
import { getDeploymentConfig, TESTNET_CHAIN_IDS } from '../shared/deploy'
import {
  IAavePoolAddressesProvider__factory,
  IERC20Metadata__factory,
  TokenPool__factory,
  ToucanOffsetter__factory,
  IToucanOffsetHelper__factory,
  SFETestUSD__factory,
  ToucanOffsetterWithPoolDeployment__factory,
  ToucanOffsetterWithPoolDeploymentApproval__factory,
} from '../typechain-types'
import { getEnd2endConfig } from './end2end-config'
import { withinRelRange } from './utils'

dayjs.extend(duration)

const ethers = hre.ethers
const MaxUint256 = ethers.constants.MaxUint256

describe('ToucanOffsetter@e2e', function () {
  this.bail(true) // fail on first error, related steps

  // End2end tests should only run on local node or forked real networks
  before(async function () {
    if (!(hre.network.name === 'hardhat')) this.skip()
  })

  async function deployToucanOffsetter() {
    const isTestnet = TESTNET_CHAIN_IDS.includes(await hre.getChainId())
    const { deployer, offsetter } = await ethers.getNamedSigners()
    const contracts = ['ToucanOffsetter', 'TokenPool']
    if (isTestnet) contracts.push('SFETestUSD', 'AaveMock', 'OffsetHelperMock')
    const depls = await hre.deployments.fixture(contracts)

    const toucanOffsetter = ToucanOffsetter__factory.connect(
      depls.ToucanOffsetter.address,
      deployer
    )

    const e2e = await getEnd2endConfig(hre)
    // For testnets, just use the named account. For real forked networs, whale
    // must be specified.
    const whale = isTestnet ? (await hre.getNamedAccounts())['whale'] : e2e.whale!
    if (!isTestnet) await impersonateAccount(whale)
    const staker = await ethers.getSigner(whale)
    const token = IERC20Metadata__factory.connect(
      isTestnet ? depls.SFETestUSD.address : e2e.token!,
      staker
    )
    if (isTestnet) await SFETestUSD__factory.connect(token.address, staker).mintMe(e2e.stake)
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
    expect(await token.balanceOf(staker.address)).to.be.gte(stake)
  })

  it('Stake, wait, then offset', async function () {
    if ('forking' in hre.network.config) this.timeout(120_000)

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
    console.log(`Claimable: ${ethers.utils.formatUnits(expYield, 6)}`)
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

  it('ToucanOffsetterWithPoolDeployment constructor should deploy pool with offsetter as ben.', async function () {
    const deployer = await ethers.getNamedSigner('deployer')
    const addrs = await getAddresses(hre)
    const ToucanOffsetter = (await hre.ethers.getContractFactory(
      'ToucanOffsetterWithPoolDeployment'
    )) as ToucanOffsetterWithPoolDeployment__factory
    const toucanOffsetter = await ToucanOffsetter.deploy(
      addrs.toucan!.offsetHelper,
      addrs.aave.poolAddressesProvider
    )

    const pool = TokenPool__factory.connect(await toucanOffsetter.pool(), deployer)
    expect(await pool.beneficiary()).to.equal(toucanOffsetter.address)
  })

  it('ToucanOffsetterWithPoolDeploymentApproval constructor should also set token approvals', async function () {
    const addrs = await getAddresses(hre)
    const tokenAddr = addrs.tokens.usdc
    const deployer = await ethers.getNamedSigner('deployer')
    const ToucanOffsetter = (await hre.ethers.getContractFactory(
      'ToucanOffsetterWithPoolDeploymentApproval'
    )) as ToucanOffsetterWithPoolDeploymentApproval__factory
    const toucanOffsetter = await ToucanOffsetter.deploy(
      addrs.toucan!.offsetHelper,
      addrs.aave.poolAddressesProvider,
      [tokenAddr]
    )

    const pool = TokenPool__factory.connect(await toucanOffsetter.pool(), deployer)
    expect(await pool.beneficiary()).to.equal(toucanOffsetter.address)

    const token = IERC20Metadata__factory.connect(tokenAddr, deployer)
    const aavePoolAP = IAavePoolAddressesProvider__factory.connect(
      addrs.aave.poolAddressesProvider,
      deployer
    )
    const aavePoolAddr = await aavePoolAP.getPool()
    expect(await token.allowance(pool.address, aavePoolAddr)).to.equal(MaxUint256)
  })
})
