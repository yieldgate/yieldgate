import { Db } from 'mongodb'

export const createCreator = async (db: Db, address: string, data?: any) => {
  return await db.collection('creators').insertOne({
    address,
    supporters: [],
    ...data,
  })
}
