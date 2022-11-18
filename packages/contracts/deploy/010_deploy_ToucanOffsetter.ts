import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getAddresses } from '../shared/addresses'
import { getDeployer } from '../shared/deploy'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployer = await getDeployer(hre)
  console.log(`Deploying as ${deployer}…`)

  const { toucan } = getAddresses(hre.network.name)
  if (!toucan) {
    throw new Error(`No toucan addresses for network ${hre.network.name}`)
  }

  const { deploy } = hre.deployments
  const deployArgs = [toucan.offsetHelper]
  console.log(`Deploying ToucanOffsetter(${deployArgs})…`)
  await deploy('ToucanOffsetter', {
    from: deployer,
    args: deployArgs,
    log: true,
  })
}
func.tags = ['ToucanOffsetter']
export default func
