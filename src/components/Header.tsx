import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {process.env.SITE_NAME || 'Blog'}
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              首页
            </Link>
            <Link 
              href="/posts" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              文章
            </Link>
            <Link 
              href="/admin" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              管理
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
