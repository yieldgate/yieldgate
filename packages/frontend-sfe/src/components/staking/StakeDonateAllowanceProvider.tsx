import { useDeployments } from '@lib/useDeployments'
import { BigNumber, constants } from 'ethers'
import { formatUnits } from 'ethers/lib/utils.js'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { erc20ABI, useAccount, useBalance, useContractRead } from 'wagmi'

export type StakeDonateAllowanceProviderContextType = {
  isApproved?: boolean
  allowance?: BigNumber
  allowanceFormatted?: string
  allowanceIsMax?: boolean
  balance?: BigNumber
  balanceIsLoading?: boolean
  balanceIsError?: boolean
}
export const StakeDonateAllowanceProviderContext =
  createContext<StakeDonateAllowanceProviderContextType>({})

export const useStakeDonateAllowanceProviderContext = () => {
  return useContext(StakeDonateAllowanceProviderContext)
}

export const StakeDonateAllowanceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isApproved, setIsApproved] = useState<boolean>()
  const [allowance, setAllowance] = useState<BigNumber>()
  const [allowanceFormatted, setAllowanceFormatted] = useState<string>()
  const [allowanceIsMax, setAllowanceIsMax] = useState<boolean>()
  const [balance, setBalance] = useState<BigNumber>()

  const { address } = useAccount()
  const { contracts, addresses, usedChainId } = useDeployments()

  // Fetch & watch USDC allowance
  useContractRead({
    address: addresses?.USDC,
    abi: usedChainId === 80001 ? (contracts?.SFETestUSD.abi as any) : erc20ABI,
    chainId: usedChainId,
    functionName: 'allowance',
    args: [
      address || constants.AddressZero,
      contracts?.TokenPoolWithApproval?.address || constants.AddressZero,
    ],
    enabled: !!address && !!addresses?.USDC && !!contracts?.TokenPoolWithApproval?.address,
    watch: true,
    onError: (e) => {
      console.error('Error while fetching allowance for USDC:', e)
      setIsApproved(false)
      setAllowance(undefined)
      setAllowanceFormatted(undefined)
      setAllowanceIsMax(false)
    },
    onSuccess: (data: BigNumber) => {
      setIsApproved(data.gt(0))
      setAllowance(data)
      setAllowanceFormatted(parseFloat(formatUnits(data, 6)).toFixed(2))
      setAllowanceIsMax(data.eq(constants.MaxUint256))
    },
  })

  // Fetch & watch USDC balance
  const token = addresses?.USDC
  const {
    data: balanceData,
    isLoading: balanceIsLoading,
    isError: balanceIsError,
  } = useBalance({
    address,
    token,
    chainId: usedChainId,
    watch: true,
  })
  useEffect(() => {
    setBalance(balanceData?.value)
  }, [balanceData])

  return (
    <StakeDonateAllowanceProviderContext.Provider
      value={{
        isApproved,
        allowance,
        allowanceFormatted,
        allowanceIsMax,
        balance,
        balanceIsLoading,
        balanceIsError,
      }}
    >
      {children}
    </StakeDonateAllowanceProviderContext.Provider>
  )
}
