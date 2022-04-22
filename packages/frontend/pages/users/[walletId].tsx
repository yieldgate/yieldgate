import { useRouter } from 'next/router'

export default function UsersPage() {
  const router = useRouter()
  const { walletId } = router.query

  return ( 
    <>{walletId}</>
  )
}
