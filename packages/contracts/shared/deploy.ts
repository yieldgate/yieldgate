// SPDX-License-Identifier: MIT

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { BigNumber, BigNumberish } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Addresses, populateDeploymentAddresses } from './addresses'
import { parseUSDC } from './utils'

dayjs.extend(duration)

export const TESTNET_CHAIN_IDS = ['1337', '5', '80001']

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
  mocks?: {
    maxMint: BigNumber
    doublingDuration: BigNumberish
    tokenOffsetRate: {
      mult: BigNumberish
      denom: BigNumberish
    }
  }
}

const DeploymentConfigs: Record<number /* chain id */, DeploymentConfig> = {
  // hardhat local
  1337: {
    tokenPool: {
      tokenApprovals: ['deployment:SFETestUSD'],
    },
    mocks: {
      maxMint: parseUSDC('1000000'), // 1 Mio
      doublingDuration: dayjs.duration(2, 'months').asSeconds(), // 50% yield in end2end test (advances by 1 month)
      tokenOffsetRate: {
        mult: 10n ** 12n, // 18 - 6 decimals
        denom: 1,
      },
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
    mocks: {
      maxMint: parseUSDC('1000000'), // 1 Mio
      doublingDuration: 600, // 10 min
      tokenOffsetRate: {
        // 1/20 i.e., 20 SFE$ for 1 TCO2
        mult: 10n ** 12n, // 18 - 6 decimals
        denom: 20,
      },
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
  return { ...conf, tokenPool: await populateDeploymentAddresses(hre, conf.tokenPool) }
}
