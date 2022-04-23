import { Db, MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/mongodb'

export interface Post {
  _id: string
  date: string
  owner: string
  title: string
  content: string
}

export type MongoDBConnection = { db: Db; client: MongoClient }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content: slug } = req.query

  switch (slug) {
    case 'create':
      return await handleCreateContent(req, res)
    case 'get':
      return await handleGetContent(req, res)
    default:
      return res.status(404).end()
  }
}

export const handleCreateContent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const post = req.body || {}
  if (!post?.owner || !post?.title || !post?.content)
    return res.status(400).end()

  const { owner, title, content } = post
  const newPost = {
    date: new Date().toUTCString(),
    owner,
    title,
    content,
  }

  const { db } = (await connectToDatabase()) as MongoDBConnection

  db.collection('posts').insertOne(newPost, (error, response) => {
    const _id = response?.insertedId
    if (error || !_id) {
      console.error('Error while saving post', newPost, error)
      return res.status(500).end()
    }
    console.log('New post inserted', _id, newPost)
    return res.status(200).json({
      _id,
      ...newPost,
    })
  })
}

export const handleGetContent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { owner } = req.body || {}
  if (!owner) return res.status(400).end()

  const { db } = (await connectToDatabase()) as MongoDBConnection
  const posts = await db
    .collection('posts')
    .find({ owner })
    .sort({ date: -1 })
    // .limit(20)
    .toArray()

  console.log('Fetched posts:', posts)

  return res.status(200).json({
    posts,
  })
}
