import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    console.log('Creating tables...')
    
    await sql`
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
    `
    
    console.log('Tables created successfully!')
    
    return NextResponse.json({ success: true, message: 'Database initialized successfully!' })
  } catch (error) {
    console.error('Database initialization failed:', error)
    return NextResponse.json(
      { success: false, error: 'Database initialization failed', details: String(error) },
      { status: 500 }
    )
  }
}
