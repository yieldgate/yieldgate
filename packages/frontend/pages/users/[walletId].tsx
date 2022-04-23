import { BlockiesAvatar } from '@components/BlockiesAvatar'
import Feed from '@components/Feed'
import Layout from '@components/layout/Layout'
import { Creator } from '@entities/Creator.entity'
import { useEthers } from '@usedapp/core'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useAsyncEffect } from 'use-async-effect'


export default function UsersPage() {
  const router = useRouter()
  let { walletId } = router.query
  if (typeof walletId !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(walletId as string)) {
    return <>Not a valid address</>
  }
  walletId = walletId.toLowerCase()
  
  const { account, chainId } = useEthers()
  const [isMyPage, setIsMyPage] = useState(false)
  const [creator, setCreator] = useState<Creator | null>(null)

  const fetchCreator = async (): Promise<Creator> => {
    const res = await fetch('/api/creators/getCreator',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: walletId,
      })
    })

    const { creator }: { creator: Creator } = await res.json()
    return creator
  }

  useEffect(() => {
    if (!walletId || !account) {
      setIsMyPage(false)
    }
    setIsMyPage(walletId === account)
  }, [account])

  useAsyncEffect(async () => {
    if (!walletId) {
      setCreator(null)
      return
    }
    const creator = await fetchCreator()
    setCreator(creator)
  }, [walletId])

  return <>
    <Layout>
      <BlockiesAvatar address={walletId} ml="4" width={250} height={250} />
      <Feed feed={creator?.posts || []} isLocked={false} />
    </Layout>
  </>
}
