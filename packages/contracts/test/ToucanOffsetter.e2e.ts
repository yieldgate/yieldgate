// SPDX-License-Identifier: MIT

import { expect } from 'chai'
import hre from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'

import { getAddresses } from '../shared/addresses'
import { getDeploymentConfig } from '../shared/deploy'
import {
  IAavePoolAddressesProvider__factory,
  IERC20Metadata__factory,
  TokenPool__factory,
  ToucanOffsetter__factory,
} from '../typechain-types'

const ethers = hre.ethers

describe('ToucanOffsetter@e2e', function () {
  // End2end tests should only run on forked real networks
  before(async function () {
    if (!(hre.network.name === 'hardhat' && 'forking' in hre.network.config)) this.skip()
  })

  async function deployToucanOffsetter() {
    const deployer = await ethers.getNamedSigner('deployer')
    const depls = await hre.deployments.fixture(['ToucanOffsetter', 'TokenPool'])

    const toucanOffsetter = ToucanOffsetter__factory.connect(
      depls.ToucanOffsetter.address,
      deployer
    )
    const tokenPool = TokenPool__factory.connect(depls.TokenPoolWithApproval.address, deployer)

    return { deployer, depls, toucanOffsetter, tokenPool }
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

    const { deployer, tokenPool } = await loadFixture(deployToucanOffsetter)
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
        ethers.constants.MaxUint256, // max allowance
        `AavePool max. allowance for token ${tokenName}`
      )
    }
  })
})
