import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { posts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { format } from 'date-fns'
import MarkdownRenderer from '@/components/MarkdownRenderer'

async function getPost(slug: string) {
  try {
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)
    
    return post[0] || null
  } catch (error) {
    return null
  }
}

export async function generateStaticParams() {
  try {
    const allPosts = await db
      .select({ slug: posts.slug })
      .from(posts)
      .where(eq(posts.published, true))
    
    return allPosts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    return []
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link 
        href="/posts" 
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回文章列表
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          {post.title}
        </h1>
        <div className="flex items-center text-gray-500 text-sm">
          <time>{format(new Date(post.createdAt), 'yyyy年MM月dd日')}</time>
          {post.updatedAt !== post.createdAt && (
            <>
              <span className="mx-2">·</span>
              <span>更新于 {format(new Date(post.updatedAt), 'yyyy年MM月dd日')}</span>
            </>
          )}
        </div>
      </header>

      {post.coverImage && (
        <div className="aspect-video relative mb-8 rounded-xl overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  )
}
