import Link from 'next/link'
import { db } from '@/db'
import { posts } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import { format } from 'date-fns'

async function getPosts() {
  try {
    const allPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt))
      .limit(10)
    
    return allPosts
  } catch (error) {
    return []
  }
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          {process.env.SITE_NAME || 'Personal Blog'}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {process.env.SITE_DESCRIPTION || 'A personal blog built with Next.js and Vercel Postgres'}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-8 text-gray-900">最新文章</h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>暂无文章</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <article key={post.id} className="card">
                <Link href={`/posts/${post.slug}`}>
                  {post.coverImage && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <time className="text-sm text-gray-500">
                      {format(new Date(post.createdAt), 'yyyy年MM月dd日')}
                    </time>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
