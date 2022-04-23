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
      return await handleCreateContent(req, res)
    // case 'get':
    //   return await handleGetContent(req, res)
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
    // Create a new creator with the post
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
    // Update the existing creator
    result = await db.collection('creators').insertOne({
      address,
      supporters: [],
      posts: [newPost],
    })
  }

  // Create new post
  if (!result) {
    return res.status(500).end()
  }

  return res.status(200).json({
    ...newPost,
  })
}

// export const handleGetContent = async (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   const { owner } = req.body || {}
//   if (!owner) return res.status(400).end()

//   const { db } = (await connectToDatabase()) as MongoDBConnection
//   const posts = await db
//     .collection('posts')
//     .find({ owner: owner.toLowerCase() })
//     .sort({ date: -1 })
//     // .limit(20)
//     .toArray()

//   console.log('Fetched posts:', posts)

//   return res.status(200).json({
//     posts,
//   })
// }
