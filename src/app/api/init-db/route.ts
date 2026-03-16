import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    console.log('Starting database initialization...')
    
    // 添加 10 秒超时处理
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database initialization timeout')), 10000)
    })

    await Promise.race([
      sql`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          excerpt TEXT,
          content TEXT NOT NULL,
          cover_image VARCHAR(500),
          published BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `,
      timeoutPromise
    ])
    
    console.log('Database tables created successfully!')
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully!',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database initialization failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Database initialization failed',
        details: String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
