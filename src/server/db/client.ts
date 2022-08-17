import { MongoClient, ServerApiVersion } from 'mongodb'

const connectionString = process.env.DATABASE_URL!

export const client = new MongoClient(connectionString, {
  serverApi: ServerApiVersion.v1,
})

client.connect()
