import { USDC_DECIMALS } from '@deployments/addresses'
import { useDeployments } from '@lib/useDeployments'
import { BigNumber, constants } from 'ethers'
import { formatUnits } from 'ethers/lib/utils.js'
import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'
import { erc20ABI, useAccount, useContractRead } from 'wagmi'

export type StakeDonateAllowanceProviderContextType = {
  isApproved?: boolean
  allowance?: BigNumber
  allowanceFormatted?: string
  allowanceIsMax?: boolean
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

  const { address } = useAccount()
  const { contracts, addresses, usedChainId } = useDeployments()

  // Check & watch for USDC allowance
  useContractRead({
    address: addresses?.USDC,
    abi: erc20ABI,
    chainId: usedChainId,
    functionName: 'allowance',
    args: [
      address || constants.AddressZero,
      contracts?.TokenPool?.address || constants.AddressZero,
    ],
    enabled: !!address && !!addresses?.USDC && !!contracts?.TokenPool?.address,
    watch: true,
    onError: (e) => {
      console.error('Error while fetching allowance for USDC:', e)
      setIsApproved(false)
      setAllowance(undefined)
      setAllowanceFormatted(undefined)
      setAllowanceIsMax(false)
    },
    onSuccess: (data) => {
      setIsApproved(data.gt(0))
      setAllowance(data)
      setAllowanceFormatted(parseFloat(formatUnits(data, USDC_DECIMALS)).toFixed(2))
      setAllowanceIsMax(data.eq(constants.MaxUint256))
    },
  })

  return (
    <StakeDonateAllowanceProviderContext.Provider
      value={{
        isApproved,
        allowance,
        allowanceFormatted,
        allowanceIsMax,
      }}
    >
      {children}
    </StakeDonateAllowanceProviderContext.Provider>
  )
}
