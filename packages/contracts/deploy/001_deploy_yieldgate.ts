import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { AaveAddresses } from '../shared/aaveAddresses'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre
  const { deploy } = deployments
  const chainId = await hre.getChainId()

  let { deployer } = await getNamedAccounts()
  if (!deployer && chainId === '1337') {
    const [signer] = await ethers.getSigners()
    deployer = signer.address
  } else if (!deployer) {
    throw new Error(`No deployer address defined for network ${hre.network.name}`)
  }
  console.log(`Deploying as ${deployer}…`)

  const aave = AaveAddresses[hre.network.name]
  if (!aave) {
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
