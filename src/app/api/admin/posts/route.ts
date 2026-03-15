import { verifyAuth } from '@/lib/auth'
import { db } from '@/db'
import { posts } from '@/db/schema'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const allPosts = await db.select().from(posts)
    return NextResponse.json(allPosts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, excerpt, content, coverImage, published } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newPost = await db
      .insert(posts)
      .values({
        title,
        slug,
        excerpt: excerpt || '',
        content,
        coverImage: coverImage || null,
        published: published || false,
      })
      .returning()

    return NextResponse.json(newPost[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
