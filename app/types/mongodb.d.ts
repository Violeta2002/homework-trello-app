// types/mongodb.d.ts
import { MongoClient } from 'mongodb'

declare global {
  namespace globalThis {
    const _mongoClientPromise: Promise<MongoClient>
  }
}