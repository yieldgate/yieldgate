import { createCreator } from '@lib/creatorsService'
import { connectToDatabase } from '@lib/mongodb'
import { Db, MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export type MongoDBConnection = { db: Db; client: MongoClient }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { supporters: slug } = req.query

  switch (slug) {
    case 'add':
      return await handleAddSupporter(req, res)
    case 'remove':
      return await handleRemoveSupporter(req, res)
    default:
      return res.status(404).end()
  }
}

export const handleAddSupporter = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let { supporter, beneficary } = req.body || {}
  if (!supporter || !beneficary) return res.status(400).end()
  if (!/^0x[a-fA-F0-9]{40}$/.test(supporter)) return res.status(400).end()
  if (!/^0x[a-fA-F0-9]{40}$/.test(beneficary)) return res.status(400).end()
  supporter = supporter.toLowerCase()
  beneficary = beneficary.toLowerCase()

  const { db } = (await connectToDatabase()) as MongoDBConnection
  const creator = await db
    .collection('creators')
    .findOne({ address: beneficary, projection: { _id: 1, supporters: 1 } })

  let result
  if (creator) {
    if ((creator.supporters || []).includes(supporter))
      return res.status(200).json({})
    // Update the existing creator
    result = await db.collection('creators').updateOne(
      { address: beneficary },
      {
        $push: {
          supporters: {
            $each: [supporter],
            $position: -1,
          },
        },
      }
    )
  } else {
    // Create a new creator with the post
    result = await createCreator(db, beneficary, {
      supporters: [supporter],
    })
  }

  return result ? res.status(200).json({}) : res.status(500).json({})
}

export const handleRemoveSupporter = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {}
