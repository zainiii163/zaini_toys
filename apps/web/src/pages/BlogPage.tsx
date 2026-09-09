import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, User, Tag, ChevronRight } from 'lucide-react'
import { useGetPostsQuery, useGetBlogCategoriesQuery } from '../app/services/blog'
import SkeletonCard from '../components/SkeletonCard'

export default function BlogPage() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { data: postsData, isLoading } = useGetPostsQuery({
    page: String(page),
    limit: '9',
    ...(category && { category }),
    ...(search && { search }),
  })
  const { data: categoriesData } = useGetBlogCategoriesQuery()

  const posts = postsData?.data || []
  const categories = categoriesData?.data || []
  const pagination = postsData?.pagination

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  return (
    <div className="container-toy py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Blog & Guides</h1>
        <p className="mt-2 text-gray-600">Toy guides, parenting tips, and the latest from our store.</p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={onSearch} className="flex w-full max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="btn-primary text-sm">Search</button>
        </form>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setCategory(''); setPage(1) }}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${!category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1) }}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${category === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-toy overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-4xl">📝</p>
          <p className="mt-4 text-gray-500">No articles found.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post._id} to={`/blog/${post.slug}`} className="card-toy group overflow-hidden">
              <div className="aspect-video overflow-hidden bg-gray-100">
                {post.featuredImage?.url ? (
                  <img src={post.featuredImage.url} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 text-4xl">📝</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-600 font-medium">{post.category}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                </div>
                <h2 className="mt-2 font-display text-lg font-semibold line-clamp-2 group-hover:text-blue-600">{post.title}</h2>
                {post.excerpt && <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  <span>{post.author?.name || 'Admin'}</span>
                  <span className="ml-auto text-blue-600 font-medium">Read more <ChevronRight className="inline h-3 w-3" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
