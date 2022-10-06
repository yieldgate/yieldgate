import { BeneficiaryPool__factory, YieldGate__factory } from '@yieldgate/contracts/typechain-types'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { BigNumber, ethers } from 'ethers'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { getProvider } from './getProvider'
import { useDeployments } from './useDeployments'
dayjs.extend(duration)

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
    const contract = YieldGate__factory.connect(contracts.YieldGate.address, getProvider(chainId))
    let value = BigNumber.from(0)
    try {
      value = await contract.staked(beneficiary)
    } catch (e) {
      console.error(e)
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
 * Returns stake (amount & lockTimeout) for given supporter and creator
 */
export type SupporterStake = {
  amount: number
  lockTimeout: number
}
export const useSupporterStake = ({
  supporter,
  beneficiary,
}: {
  supporter?: string
  beneficiary?: string
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contractsChain, contractsChainId, contracts } = useDeployments()
  const [supporterStakes, setSupporterStakes] = useState<{
    [key: string]: SupporterStake
  }>({})

  const refetch = async (chainId: number | undefined) => {
    if (!supporter || !beneficiary || !contracts || !chainId) return
    setIsLoading(true)
    const contract = YieldGate__factory.connect(contracts.YieldGate.address, getProvider(chainId))
    let amount = BigNumber.from(0)
    let lockTimeout = BigNumber.from(0)
    try {
      ;[amount, lockTimeout] = await contract.supporterStaked(supporter, beneficiary)
    } catch (e) {
      console.error(e)
    }
    setSupporterStakes((prev) => ({
      ...prev,
      [chainId]: {
        amount: parseFloat(formatEther(amount) || '0.0'),
        lockTimeout: parseInt(lockTimeout.toString() || '0'),
      },
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch(contractsChainId)
  }, [supporter, beneficiary, contractsChainId])

  return {
    isLoading,
    supporterStakes,
    ...(contractsChainId ? { supporterStake: supporterStakes[contractsChainId] } : {}),
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
    const contract = YieldGate__factory.connect(contracts.YieldGate.address, getProvider(chainId))
    let value = BigNumber.from(0)
    try {
      value = await contract.claimable(beneficiary)
    } catch (e) {
      console.error(e)
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
      const factoryContract = YieldGate__factory.connect(
        contracts.YieldGate.address,
        getProvider(chainId)
      )
      poolAddress = await factoryContract.beneficiaryPools(beneficiary)
      if (!poolAddress || poolAddress === ethers.constants.AddressZero) {
        poolAddress = false
      }
    } catch (e) {
      console.error(e)
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
      const poolContract = BeneficiaryPool__factory.connect(poolAddress, getProvider(chainId))
      minAmount = await poolContract.minAmount()
      minDurationSeconds = await poolContract.minDuration()
    } catch (e) {
      console.error(e)
    }
    setMinAmounts((prev) => ({
      ...prev,
      [chainId]: parseFloat(formatEther(minAmount) || '0.0'),
    }))
    setMinDurationsDays((prev) => ({
      ...prev,
      [chainId]: dayjs.duration(minDurationSeconds.toNumber(), 'seconds').asDays(),
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
