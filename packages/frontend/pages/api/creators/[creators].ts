import { connectToDatabase } from '@lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

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
  const { db } = await connectToDatabase()
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

  // console.log('Fetched creators:', creators)

  return res.status(200).json({
    creators,
  })
}

export const handleGetCreator = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let { address } = req.body || {}
  if (!address) return res.status(400).end()
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return res.status(400).end()
  address = address.toLowerCase()

  const { db } = await connectToDatabase()
  let creator: any = await db.collection('creators').findOne({ address })

  // console.log('Fetched creator:', creator)
  if (!creator) {
    creator = {
      _id: address,
      address,
    }
  }

  creator.supportersCount = creator?.supporters?.length || 0
  creator.postsCount = creator?.posts?.length || 0

  return res.status(200).json({
    creator,
  })
}
