import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client.js'
import env from './env.js'

const connectionString = env.DATABASE_URL

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
})

export { prisma }
