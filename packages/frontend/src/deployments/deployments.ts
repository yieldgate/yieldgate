import { env } from '@lib/environment'
import { HardhatExport } from 'src/types/hardhat'

/**
 * Dynamically aggregating all deployments (addresses, abis)
 */

const getDeploymentForChainId = async (chainId: number) => {
  try {
    return await import(`./${chainId}.json`)
  } catch (e) {
    throw new Error(
      `Can't find deployment for supported chain (${chainId}) under 'src/deployments/${chainId}.json'.`
    )
  }
}

export type DeploymentsType = { [_: number]: Promise<HardhatExport> }

export const deployments: DeploymentsType = env.supportedChains.reduce(
  (acc: DeploymentsType, chainId: number) => ({
    ...acc,
    [chainId]: getDeploymentForChainId(chainId),
  }),
  {}
)
