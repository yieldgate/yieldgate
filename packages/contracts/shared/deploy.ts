import { HardhatRuntimeEnvironment } from 'hardhat/types'

export async function getDeployer(hre: HardhatRuntimeEnvironment): Promise<string> {
  const chainId = await hre.getChainId()
  let { deployer } = await hre.getNamedAccounts()
  if (!deployer && chainId === '1337') {
    const [signer] = await hre.ethers.getSigners()
    deployer = signer.address
  } else if (!deployer) {
    throw new Error(`No deployer address defined for network ${hre.network.name}`)
  }
  return deployer
}
