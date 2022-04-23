import { useEthers } from '@usedapp/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import { Post } from '../api/content/[content]'

export default function UsersPage() {
  const router = useRouter()
  const { walletId } = router.query
  const { account } = useEthers()
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
  }, [walletId])

  return <>
    <>{walletId}</>
    <>{isMyPage ? 'IS MY PAGE' : 'IS NOT MY PAGE'}</>
    {posts.map((post) => <div key={post._id}>
      {JSON.stringify(post, null, 4 )}
    </div>)}
  </>
}
