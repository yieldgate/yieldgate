// SPDX-License-Identifier: MIT

import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getDeploymentConfig, getDeployer, TESTNET_CHAIN_IDS } from '../shared/deploy'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployer = await getDeployer(hre)
  console.log(`Deploying as ${deployer}…`)

  const { mocks } = await getDeploymentConfig(hre)
  if (!mocks) {
    throw new Error('No mocks deployment config for selected network')
  }

  const { deploy, execute } = hre.deployments

  const tokenDepl = await deploy('SFETestUSD', {
    from: deployer,
    args: [mocks.maxMint],
    log: true,
  })
  const sfeUSD = tokenDepl.address

  await deploy('AaveMock', {
    from: deployer,
    args: [sfeUSD, mocks.doublingDuration],
    log: true,
  })

  await deploy('OffsetHelperMock', {
    from: deployer,
    log: true,
  })

  await execute(
    'OffsetHelperMock',
    { from: deployer, log: true },
    'setRate',
    sfeUSD,
    mocks.tokenOffsetRate.mult,
    mocks.tokenOffsetRate.denom
  )
}
func.tags = ['SFETestUSD', 'AaveMock', 'OffsetHelperMock']
func.skip = async (hre: HardhatRuntimeEnvironment) => {
  const chainId = await hre.getChainId()
  // only deploy mocks for testnets
  return !TESTNET_CHAIN_IDS.includes(chainId)
}
export default func
