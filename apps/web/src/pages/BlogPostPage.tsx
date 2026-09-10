import { useParams, Link } from 'react-router-dom'
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react'
import { useGetPostBySlugQuery } from '../app/services/blog'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: postData, isLoading } = useGetPostBySlugQuery(slug || '', { skip: !slug })

  if (isLoading) {
    return (
      <div className="container-toy py-8">
        <div className="mx-auto max-w-3xl space-y-4 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-3/4 bg-gray-200 rounded" />
          <div className="aspect-video bg-gray-200 rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!postData?.success || !postData.data) {
    return (
      <div className="container-toy py-12 text-center">
        <p className="text-4xl">📝</p>
        <p className="mt-4 text-gray-500">Article not found.</p>
        <Link to="/blog" className="btn-primary mt-4 inline-block">Back to Blog</Link>
      </div>
    )
  }

  const post = postData.data

  return (
    <div className="container-toy py-8">
      <Link to="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <article className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-600 font-medium">{post.category}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author?.name || 'Admin'}</span>
        </div>

        <h1 className="mt-3 font-display text-3xl font-bold text-gray-900">{post.title}</h1>

        {post.excerpt && <p className="mt-3 text-lg text-gray-600">{post.excerpt}</p>}

        {post.featuredImage?.url && (
          <div className="mt-6 overflow-hidden rounded-2xl">
            <img src={post.featuredImage.url} alt={post.title} className="w-full object-cover" />
          </div>
        )}

        <div className="prose prose-lg mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

        {post.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                <Tag className="h-3 w-3" />{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 border-t border-gray-200 pt-4">
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
            <Share2 className="h-4 w-4" /> Share this article
          </button>
        </div>
      </article>
    </div>
  )
}
