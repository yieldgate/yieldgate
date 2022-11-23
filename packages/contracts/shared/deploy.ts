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

const DeploymentConfigs: Record<number /* chain id */, DeploymentConfig> = {
  // hardhat local
  1337: {
    tokenPool: {
      tokenApprovals: [],
    },
  },
  // Polygon mainnet
  137: {
    tokenPool: {
      tokenApprovals: [Addresses[137].tokens.usdc],
    },
  },
  // Polygon Mumbai
  80001: {
    tokenPool: {
      tokenApprovals: [Addresses[80001].tokens.usdc, Addresses[80001].tokens.wmatic!],
    },
  },
}

export async function getDeploymentConfig(
  hre: HardhatRuntimeEnvironment
): Promise<DeploymentConfig> {
  const chainId = parseInt(await hre.getChainId())
  const conf = DeploymentConfigs[chainId]
  if (!conf) {
    throw new Error(`No deployment configuration for network ${chainId}`)
  }
  return conf
}
