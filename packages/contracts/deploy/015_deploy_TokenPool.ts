// SPDX-License-Identifier: MIT

import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getAddresses } from '../shared/addresses'
import { getDeploymentConfig, getDeployer } from '../shared/deploy'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployer = await getDeployer(hre)
  console.log(`Deploying as ${deployer}…`)

  const { aave } = await getAddresses(hre)
  const deployCfg = await getDeploymentConfig(hre)
  const toucanOffsetterDepl = await hre.deployments.get('ToucanOffsetter')

  const { deploy, execute } = hre.deployments
  const deployArgs = [
    aave.poolAddressesProvider,
    toucanOffsetterDepl.address, // beneficiary
    deployCfg.tokenPool.tokenApprovals,
  ]
  console.log(`Deploying TokenPoolWithApproval(${deployArgs})…`)
  const tokenPoolDepl = await deploy('TokenPoolWithApproval', {
    from: deployer,
    args: deployArgs,
    log: true,
  })
  if (tokenPoolDepl.receipt?.status !== 1) {
    throw new Error(`TokenPool deployment failed`)
  }
  const tokenPoolAddr = tokenPoolDepl.address

  console.log(`Setting pool on ToucanOffsetter to TokenPool(${tokenPoolAddr})…`)
  const receipt = await execute(
    'ToucanOffsetter',
    { from: deployer, log: true },
    'setYGPool',
    tokenPoolAddr
  )
  if (receipt.status !== 1) {
    console.log('Calling ToucanOffsetter.setYGPool failed!')
  }
}
func.dependencies = ['ToucanOffsetter']
func.tags = ['TokenPool']
export default func
