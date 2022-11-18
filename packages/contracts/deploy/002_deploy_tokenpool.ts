import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getAddresses } from '../shared/addresses'
import { getDeploymentConfig, getDeployer } from '../shared/deploy'
import * as dotenv from 'dotenv'
dotenv.config()

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployer = await getDeployer(hre)
  console.log(`Deploying as ${deployer}…`)

  const { aave } = getAddresses(hre.network.name)
  const { tokenPool } = getDeploymentConfig(hre.network.name)
  const beneficiary = process.env.POOL_BENEFICIARY

  const { deploy } = hre.deployments
  const deployArgs = [aave.poolAddressesProvider, beneficiary, tokenPool.tokenApprovals]
  console.log(`Deploying TokenPoolWithApproval(${deployArgs})…`)
  await deploy('TokenPoolWithApproval', {
    from: deployer,
    args: deployArgs,
    log: true,
  })
}
func.tags = ['TokenPool']
export default func
