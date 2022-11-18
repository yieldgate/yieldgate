import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Addresses } from './addresses'

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

export type DeploymentConfig = {
  tokenPool: {
    tokenApprovals: string[]
  }
}

const DeploymentConfigs: Record<string /* network name */, DeploymentConfig> = {
  hardhat: {
    tokenPool: {
      tokenApprovals: [],
    },
  },
  mumbai: {
    tokenPool: {
      tokenApprovals: [Addresses.mumbai.tokens.usdc, Addresses.mumbai.tokens.wmatic!],
    },
  },
}

export function getDeploymentConfig(network: string): DeploymentConfig {
  const conf = DeploymentConfigs[network]
  if (!conf) {
    throw new Error(`No deployment configuration for network ${network}`)
  }
  return conf
}
