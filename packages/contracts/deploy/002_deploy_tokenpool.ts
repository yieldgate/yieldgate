import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { AaveAddresses } from '../shared/aaveAddresses'
import { getDeployer } from '../shared/deploy'
import * as dotenv from 'dotenv'
dotenv.config()

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployer = await getDeployer(hre)
  console.log(`Deploying as ${deployer}…`)

  const aave = AaveAddresses[hre.network.name]
  if (!aave) {
    throw new Error(`No Aave addresses for network ${hre.network.name}`)
  }

  const beneficiary = process.env.POOL_BENEFICIARY

  const { deploy } = hre.deployments
  console.log(`Deploying TokenPool(${aave.poolAddressesProvider}, ${beneficiary})…`)
  await deploy('TokenPool', {
    from: deployer,
    args: [aave.poolAddressesProvider, beneficiary],
    log: true,
  })
}
func.tags = ['TokenPool']
export default func
