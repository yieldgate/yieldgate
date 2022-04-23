import { useEthers } from '@usedapp/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function UsersPage() {
  const router = useRouter()
  const { walletId } = router.query
  const { account } = useEthers()
  const [isMyPage, setIsMyPage] = useState(false)

  useEffect(() => {
    if (!walletId || !account) {
      setIsMyPage(false)
      return
    }
    setIsMyPage(walletId === account)
  }, [account])

  return <>
    <>{walletId}</>
    <>{isMyPage ? 'IS MY PAGE' : 'IS NOT MY PAGE'}</>
  </>
}
