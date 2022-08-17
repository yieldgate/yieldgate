import { env } from '@lib/environment'
import { YieldGate } from '@yieldgate/contracts/typechain-types'
import { BigNumber, ethers, getDefaultProvider } from 'ethers'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { useDeployments } from './useDeployments'

/**
 * Returns total staked amount for given beneficiary address
 */
export const useTotalAmountStaked = ({ beneficiary }: { beneficiary: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contracts, contractsChain, contractsChainId } = useDeployments()

  const [totalAmountsStaked, setTotalAmountsStaked] = useState<{
    [key: string]: number
  }>({})

  const refetch = async (chainId: number | undefined) => {
    if (!beneficiary || !contracts || !chainId) return
    setIsLoading(true)
    const provider = getDefaultProvider(env.rpcUrls[chainId as keyof typeof env.rpcUrls])
    const contract = new ethers.Contract(
      contracts.YieldGate.address,
      contracts.YieldGate.abi,
      provider
    ) as YieldGate
    let value = BigNumber.from(0)
    try {
      value = await contract.staked(beneficiary)
    } catch (e) {
      // do nothing
    }
    setTotalAmountsStaked((prev) => ({
      ...prev,
      [chainId]: parseFloat(formatEther(value) || '0.0'),
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch(contractsChainId)
  }, [beneficiary, contractsChainId])

  return {
    isLoading,
    totalAmountsStaked,
    totalAmountStaked: contractsChainId && totalAmountsStaked[contractsChainId],
    contractChain: contractsChain,
    contractChainId: contractsChainId,
    refetch: async () => {
      refetch(contractsChainId)
    },
  }
}

/**
 * Returns total staked amount for given creator address
 */
export const useSupporterAmountStaked = ({
  supporter,
  beneficiary,
}: {
  supporter?: string
  beneficiary?: string
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contractsChain, contractsChainId, contracts } = useDeployments()
  const [supporterAmountsStaked, setSupporterAmountsStaked] = useState<{
    [key: string]: number
  }>({})

  const refetch = async (chainId: number | undefined) => {
    if (!supporter || !beneficiary || !contracts || !chainId) return
    setIsLoading(true)
    const provider = getDefaultProvider(env.rpcUrls[chainId as keyof typeof env.rpcUrls])
    const contract = new ethers.Contract(
      contracts.YieldGate.address,
      contracts.YieldGate.abi,
      provider
    ) as YieldGate
    let value = BigNumber.from(0)
    try {
      value = await contract.supporterStaked(supporter, beneficiary)
    } catch (e) {
      // do nothing
    }
    setSupporterAmountsStaked((prev) => ({
      ...prev,
      [chainId]: parseFloat(formatEther(value) || '0.0'),
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch(contractsChainId)
  }, [supporter, beneficiary, contractsChainId])

  return {
    isLoading,
    supporterAmountsStaked,
    supporterAmountStaked: contractsChainId && supporterAmountsStaked[contractsChainId],
    contractChain: contractsChain,
    contractChainId: contractsChainId,
    refetch: async () => {
      refetch(contractsChainId)
    },
  }
}

/**
 * Returns total claimable amount for given creator address
 */
export const useClaimableAmount = ({ beneficiary }: { beneficiary?: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contractsChain, contractsChainId, contracts } = useDeployments()
  const [claimableAmounts, setClaimableAmounts] = useState<{
    [key: string]: number
  }>({})

  const refetch = async (chainId: number | undefined) => {
    if (!beneficiary || !contracts || !chainId) return
    setIsLoading(true)
    const provider = getDefaultProvider(env.rpcUrls[chainId as keyof typeof env.rpcUrls])
    const contract = new ethers.Contract(
      contracts.YieldGate.address,
      contracts.YieldGate.abi,
      provider
    ) as YieldGate
    let value = BigNumber.from(0)
    try {
      value = await contract.claimable(beneficiary)
    } catch (e) {
      // do nothing
    }
    setClaimableAmounts((prev) => ({
      ...prev,
      [chainId]: parseFloat(formatUnits(value, 'finney') || '0.0'),
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch(contractsChainId)
  }, [beneficiary, contractsChainId])

  return {
    isLoading,
    claimableAmounts,
    claimableAmount: contractsChainId && claimableAmounts[contractsChainId],
    contractChain: contractsChain,
    contractChainId: contractsChainId,
    refetch: async () => {
      refetch(contractsChainId)
    },
  }
}
