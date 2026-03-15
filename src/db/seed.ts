import { sql } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { posts } from './schema'

async function main() {
  const db = drizzle(sql)
  
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
  
  const existingPosts = await db.select().from(posts)
  
  if (existingPosts.length === 0) {
    console.log('Inserting sample post...')
    
    await db.insert(posts).values({
      title: '欢迎来到我的博客',
      slug: 'welcome-to-my-blog',
      excerpt: '这是我的第一篇博客文章，介绍了这个博客系统的功能。',
      content: `# 欢迎来到我的博客

这是我的第一篇博客文章！

## 关于这个博客

这个博客使用以下技术栈构建：

- **Next.js** - React 全栈框架
- **Vercel Postgres** - 托管数据库
- **Tailwind CSS** - 样式框架
- **Markdown** - 文章内容格式

## 功能特点

### Markdown 支持

支持完整的 Markdown 语法，包括：

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### 代码高亮

代码块会自动进行语法高亮显示。

### 响应式设计

博客完全响应式，在各种设备上都能良好显示。

## 开始写作

登录管理后台即可开始创建你的文章！

> 这是一段引用文字

| 功能 | 状态 |
|------|------|
| Markdown | ✅ |
| 代码高亮 | ✅ |
| 响应式 | ✅ |

感谢访问！
`,
      coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200',
      published: true,
    })
    
    console.log('Sample post inserted!')
  }
  
  console.log('Database setup complete!')
}

main().catch((err) => {
  console.error('Setup failed:', err)
  process.exit(1)
})
