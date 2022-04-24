import { createCreator } from '@lib/creatorsService'
import { Db, MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/mongodb'

export type MongoDBConnection = { db: Db; client: MongoClient }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content: slug } = req.query

  switch (slug) {
    case 'create':
      return await handlePushContent(req, res)
    default:
      return res.status(404).end()
  }
}

export const handlePushContent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const post = req.body || {}
  if (!post?.owner || !post?.title || !post?.content)
    return res.status(400).end()
  const { title, content } = post
  const newPost = {
    date: new Date().toUTCString(),
    title,
    content,
  }

  const { db } = (await connectToDatabase()) as MongoDBConnection

  // Fetch creator
  const address = post.owner.toLowerCase()
  const creator = await db.collection('creators').findOne({ address })
  let result
  if (creator) {
    // Update the existing creator
    result = await db.collection('creators').updateOne(
      { address },
      {
        $push: {
          posts: {
            $each: [newPost],
            $position: 0,
          },
        },
      }
    )
  } else {
    // Create a new creator with the post
    result = await createCreator(db, address, {
      posts: [newPost],
    })
  }

  // Create new post
  if (!result) {
    return res.status(500).end()
  }

  return res.status(200).json({
    newPost,
  })
}
