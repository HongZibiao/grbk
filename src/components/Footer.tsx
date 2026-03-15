export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} {process.env.SITE_NAME || 'Personal Blog'}. 
            Built with Next.js and Vercel Postgres.
          </p>
        </div>
      </div>
    </footer>
  )
}
