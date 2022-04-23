import { connectToDatabase } from '@lib/mongodb'
import { Db, MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export type MongoDBConnection = { db: Db; client: MongoClient }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { creators: slug } = req.query

  switch (slug) {
    case 'getCreator':
      return await handleGetCreator(req, res)
    case 'getAllCreators':
      return await handleGetAllCreators(req, res)
    default:
      return res.status(404).end()
  }
}

export const handleGetAllCreators = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { db } = (await connectToDatabase()) as MongoDBConnection
  const creators = await db
    .collection('creators')
    .find({})
    // .project({ _id: 1, address: 1, displayName: 1, description: 1 })
    // .sort({ date: -1 })
    // .limit(20)
    .toArray()

  creators.forEach((creator) => {
    creator.postsCount = creator.posts?.length
    delete creator.posts
    creator.supportersCount = creator.supporters?.length
    delete creator.supporters
  })

  console.log('Fetched creators:', creators)

  return res.status(200).json({
    creators,
  })
}

export const handleGetCreator = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { address } = req.body || {}
  if (!address) return res.status(400).end()

  const { db } = (await connectToDatabase()) as MongoDBConnection
  const creator = await db
    .collection('creators')
    .findOne({ address: address.toLowerCase() })

  if (!creator) return res.status(404).end()

  creator.supportersCount = creator?.supporters?.length
  creator.postsCount = creator?.posts?.length

  console.log('Fetched creator:', creator)

  return res.status(200).json({
    creator,
  })
}
