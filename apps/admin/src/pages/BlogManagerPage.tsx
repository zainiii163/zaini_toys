import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../app/api'

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  category: string
  isPublished: boolean
  viewCount: number
  publishedAt: string
  createdAt: string
  author: { name: string; email: string }
}

export default function BlogManagerPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('Guides')
  const [isPublished, setIsPublished] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/blog/admin/all')
      setPosts(res.data.data || [])
    } catch {}
    setLoading(false)
  }

  useState(() => { fetchPosts() })

  const resetForm = () => {
    setTitle(''); setContent(''); setExcerpt(''); setCategory('Guides'); setIsPublished(false); setEditingId(null); setShowForm(false)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) { toast.error('Title and content required'); return }
    try {
      if (editingId) {
        await api.put(`/blog/${editingId}`, { title, content, excerpt, category, isPublished })
        toast.success('Post updated')
      } else {
        await api.post('/blog', { title, content, excerpt, category, isPublished })
        toast.success('Post created')
      }
      resetForm()
      fetchPosts()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed')
    }
  }

  const onEdit = (post: BlogPost) => {
    setEditingId(post._id); setTitle(post.title); setExcerpt(post.excerpt || ''); setCategory(post.category); setIsPublished(post.isPublished); setShowForm(true)
  }

  const onDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    try { await api.delete(`/blog/${id}`); toast.success('Deleted'); fetchPosts() } catch { toast.error('Failed') }
  }

  const togglePublish = async (post: BlogPost) => {
    try { await api.put(`/blog/${post._id}`, { isPublished: !post.isPublished }); toast.success(post.isPublished ? 'Unpublished' : 'Published'); fetchPosts() } catch { toast.error('Failed') }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Manager</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="stat-card mb-6">
          <h2 className="mb-4 font-semibold">{editingId ? 'Edit Post' : 'New Post'}</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Excerpt</label>
              <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm">
                  <option>Guides</option><option>Tips</option><option>News</option><option>Reviews</option><option>Parenting</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="rounded" />
                  Published
                </label>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Content (HTML)</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="w-full rounded-lg border border-gray-300 p-2 text-sm font-mono" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="btn-primary text-sm">Save</button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="stat-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Views</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">Loading...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">No posts yet</td></tr>
            ) : posts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="p-3">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{post.excerpt}</p>
                </td>
                <td className="p-3"><span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{post.category}</span></td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="p-3 text-gray-500">{post.viewCount || 0}</td>
                <td className="p-3 text-gray-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => togglePublish(post)} className="rounded p-1.5 hover:bg-gray-100" title={post.isPublished ? 'Unpublish' : 'Publish'}>
                      {post.isPublished ? <EyeOff className="h-4 w-4 text-orange-500" /> : <Eye className="h-4 w-4 text-green-500" />}
                    </button>
                    <button onClick={() => onEdit(post)} className="rounded p-1.5 hover:bg-gray-100" title="Edit">
                      <Edit2 className="h-4 w-4 text-blue-500" />
                    </button>
                    <button onClick={() => onDelete(post._id)} className="rounded p-1.5 hover:bg-gray-100" title="Delete">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
