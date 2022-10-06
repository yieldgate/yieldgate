import { env } from '@lib/environment'
import { HardhatExport } from 'src/types/hardhat'

/**
 * Dynamically aggregating all deployments (addresses, abis)
 */

export type DeploymentsType = { [_: number]: Promise<HardhatExport> }

export const deployments: DeploymentsType = env.supportedChains.reduce(
  (acc: DeploymentsType, chainId: number) => ({
    ...acc,
    [chainId]: import(`./${chainId}.json`),
  }),
  {}
)
