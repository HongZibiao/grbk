import { sql } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/vercel-postgres'

// 检查 POSTGRES_URL 是否存在
if (!process.env.POSTGRES_URL) {
    console.warn('POSTGRES_URL environment variable is not set')
}

export const db = drizzle(sql, {
    logger: process.env.NODE_ENV === 'development'
})

