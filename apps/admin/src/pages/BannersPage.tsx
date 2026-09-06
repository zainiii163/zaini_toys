import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useGetBannersQuery, useCreateBannerMutation, useDeleteBannerMutation } from '../app/services/banner'

export default function BannersPage() {
  const { data, isLoading } = useGetBannersQuery()
  const [createBanner] = useCreateBannerMutation()
  const [deleteBanner] = useDeleteBannerMutation()
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [link, setLink] = useState('')

  const banners = data?.data || []

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    await createBanner({ title, subtitle, link, isActive: true, position: 'home' })
    setTitle('')
    setSubtitle('')
    setLink('')
  }

  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Banners</h1>
      <div className="stat-card mb-6">
        <h2 className="mb-4 font-semibold">Add Banner</h2>
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Title" required />
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputClass} placeholder="Subtitle" />
          <input value={link} onChange={(e) => setLink(e.target.value)} className={inputClass} placeholder="Link URL" />
          <div className="sm:col-span-3">
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"><Plus className="mr-1 inline h-4 w-4" /> Add Banner</button>
          </div>
        </form>
      </div>

      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((b: any) => (
            <div key={b._id} className="stat-card relative">
              <button onClick={() => deleteBanner(b._id)} className="absolute right-3 top-3 rounded p-1 bg-white shadow hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></button>
              <div className="mb-2 h-32 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
              <h3 className="font-semibold">{b.title}</h3>
              {b.subtitle && <p className="text-sm text-gray-500">{b.subtitle}</p>}
              <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          ))}
          {banners.length === 0 && <p className="text-gray-500">No banners yet.</p>}
        </div>
      )}
    </div>
  )
}
