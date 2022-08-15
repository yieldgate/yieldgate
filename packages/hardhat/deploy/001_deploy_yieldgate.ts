import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { AaveAddresses } from 'shared/aaveAddresses'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()
  console.log(`Deploying as ${deployer}…`)

  const aave = AaveAddresses[hre.network.name]
  if (aave === undefined) {
    throw new Error(`No Aave addresses for network ${hre.network.name}`)
  }

  await deploy('YieldGate', {
    from: deployer,
    args: [aave.pool, aave.wETHGateway, aave.nativeAToken],
    log: true,
  })
}
func.tags = ['YieldGate']
export default func
