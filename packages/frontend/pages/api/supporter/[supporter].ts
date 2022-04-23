import { Db, MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export interface Support {
  _id: string
  supporter: string
  beneficary: string
}

export type MongoDBConnection = { db: Db; client: MongoClient }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content: slug } = req.query

  switch (slug) {
    case 'add':
      return await handleAddSupport(req, res)
    case 'remove':
      return await handleRemoveSupport(req, res)
    default:
      return res.status(404).end()
  }
}

export const handleAddSupport = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // TODO
}

export const handleRemoveSupport = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // TODO
}
