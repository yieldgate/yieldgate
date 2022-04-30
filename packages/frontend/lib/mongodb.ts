import { Db, MongoClient } from 'mongodb'
import { env } from './environment'

let cachedClient: any
let cachedDb: any

export type MongoDBConnection = { db: Db; client: MongoClient }

export async function connectToDatabase(): Promise<MongoDBConnection> {
  const uri = env.mongo.uri
  const dbName = process.env.MONGODB_DB
  if (!uri || !dbName) {
    throw new Error(
      'Please define the mongo environment variables inside .env.local'
    )
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(uri)
  await client.connect()
  const db = await client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}
