import { env } from '@lib/environment'
import { BeneficiaryPool__factory, YieldGate__factory } from '@yieldgate/contracts/typechain-types'
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
    const contract = YieldGate__factory.connect(contracts.YieldGate.address, provider)
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
    ...(contractsChainId ? { totalAmountStaked: totalAmountsStaked[contractsChainId] } : {}),
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
    const contract = YieldGate__factory.connect(contracts.YieldGate.address, provider)
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
    ...(contractsChainId
      ? { supporterAmountStaked: supporterAmountsStaked[contractsChainId] }
      : {}),
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
    const contract = YieldGate__factory.connect(contracts.YieldGate.address, provider)
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
    ...(contractsChainId ? { claimableAmount: claimableAmounts[contractsChainId] } : {}),
    contractChain: contractsChain,
    contractChainId: contractsChainId,
    refetch: async () => {
      refetch(contractsChainId)
    },
  }
}

/**
 * Returns the pool address for a given creator
 */
export const usePoolAddress = ({ beneficiary }: { beneficiary?: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contractsChain, contractsChainId, contracts } = useDeployments()
  const [poolAddresses, setPoolAddresses] = useState<{
    [_: string]: string | false
  }>({})

  const refetch = async (chainId: number | undefined) => {
    if (!beneficiary || !contracts || !chainId) return
    setIsLoading(true)
    setPoolAddresses((prev) => ({
      ...prev,
      [chainId]: undefined,
    }))
    let poolAddress: string | false
    try {
      const provider = getDefaultProvider(env.rpcUrls[chainId as keyof typeof env.rpcUrls])
      const factoryContract = YieldGate__factory.connect(contracts.YieldGate.address, provider)
      poolAddress = await factoryContract.beneficiaryPools(beneficiary)
      if (!poolAddress || poolAddress === ethers.constants.AddressZero) {
        poolAddress = false
      }
    } catch (e) {
      // do nothing
    }
    setPoolAddresses((prev) => ({
      ...prev,
      [chainId]: poolAddress,
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch(contractsChainId)
  }, [beneficiary, contractsChainId])

  return {
    isLoading,
    poolAddresses,
    ...(contractsChainId ? { poolAddress: poolAddresses[contractsChainId] } : {}),
    contractChain: contractsChain,
    contractChainId: contractsChainId,
    refetch: async () => {
      refetch(contractsChainId)
    },
  }
}

/**
 * Returns the pool parameters (minAmount, minDurationDays) for a given `poolAddress`
 */
export const usePoolParams = ({ poolAddress }: { poolAddress?: string | false }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contractsChain, contractsChainId, contracts } = useDeployments()
  const [minAmounts, setMinAmounts] = useState<{
    [_: string]: string
  }>({})
  const [minDurationsDays, setMinDurationsDays] = useState<{
    [_: string]: number
  }>({})

  const refetch = async (chainId: number | undefined) => {
    if (!contracts || !chainId) return
    if (!poolAddress) {
      setMinAmounts((prev) => ({
        ...prev,
        [chainId]: undefined,
      }))
      setMinDurationsDays((prev) => ({
        ...prev,
        [chainId]: undefined,
      }))
      return
    }

    setIsLoading(true)
    let minAmount = BigNumber.from(0)
    let minDurationSeconds = BigNumber.from(0)
    try {
      const provider = getDefaultProvider(env.rpcUrls[chainId as keyof typeof env.rpcUrls])
      const poolContract = BeneficiaryPool__factory.connect(poolAddress, provider)
      minAmount = await poolContract.minAmount()
      minDurationSeconds = await poolContract.minDuration()
    } catch (e) {
      // do nothing
    }
    setMinAmounts((prev) => ({
      ...prev,
      [chainId]: parseFloat(formatEther(minAmount) || '0.0'),
    }))
    setMinDurationsDays((prev) => ({
      ...prev,
      [chainId]: parseInt(formatEther(minDurationSeconds) || '0.0') / 24 / 60 / 60,
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch(contractsChainId)
  }, [poolAddress, contractsChainId])

  return {
    isLoading,
    minAmounts,
    ...(contractsChainId ? { minAmount: minAmounts[contractsChainId] } : {}),
    minDurationsDays,
    ...(contractsChainId ? { minDurationDays: minDurationsDays[contractsChainId] } : {}),
    contractChain: contractsChain,
    contractChainId: contractsChainId,
    refetch: async () => {
      refetch(contractsChainId)
    },
  }
}
