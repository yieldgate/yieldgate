import { useState } from 'react'
import useAsyncEffect from 'use-async-effect'
import { useProvider } from 'wagmi'

export const useEnsDomain = ({ address }: { address?: string }) => {
  const [ensDomain, setEnsDomain] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const provider = useProvider({ chainId: 1 })

  useAsyncEffect(async () => {
    if (!address) {
      setEnsDomain('')
      return
    }
    setIsLoading(true)
    const ens = await provider.lookupAddress(address)
    setEnsDomain(ens || '')
    setIsLoading(false)
  }, [address])

  return { ensDomain, isLoading }
}
