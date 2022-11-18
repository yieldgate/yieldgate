import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getAddresses } from '../shared/addresses'
import { getDeployer } from '../shared/deploy'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployer = await getDeployer(hre)
  console.log(`Deploying as ${deployer}…`)

  const { aave } = getAddresses(hre.network.name)

  const { deploy } = hre.deployments
  const deployArgs = [aave.pool, aave.wETHGateway, aave.nativeAToken]
  console.log(`Deploying YieldGate(${deployArgs})…`)
  await deploy('YieldGate', {
    from: deployer,
    args: deployArgs,
    log: true,
  })
}
func.tags = ['YieldGate']
export default func
