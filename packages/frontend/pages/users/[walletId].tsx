import { BlockiesAvatar } from '@components/BlockiesAvatar'
import Feed from '@components/Feed'
import Layout from '@components/layout/Layout'
import { Post } from '@entities/Post.entity'
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
  const [posts, setPosts] = useState<Post[]>([])

  const fetchPosts = async (): Promise<Post[]> => {
    const res = await fetch('/api/content/get',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        owner: walletId,
      })
    })

    const { posts }: { posts: Post[] } = await res.json()
    return posts
  }

  useEffect(() => {
    if (!walletId || !account) {
      setIsMyPage(false)
    }
    setIsMyPage(walletId === account)
  }, [account])

  useAsyncEffect(async () => {
    if (!walletId) {
      setPosts([])
      return
    }

    const posts = await fetchPosts()
    setPosts(posts)
  }, [walletId, chainId])

  return <>
    <Layout>
      <BlockiesAvatar address={walletId} ml="4" width={250} height={250} />
      <Feed feed={posts} isLocked={false} />
    </Layout>
  </>
}
