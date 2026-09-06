import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../app/services/category'

export default function CategoriesPage() {
  const { data, isLoading } = useGetCategoriesQuery()
  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const categories = data?.data || []

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    if (editingId) {
      await updateCategory({ id: editingId, body: { name, description } })
      setEditingId(null)
    } else {
      await createCategory({ name, description })
    }
    setName('')
    setDescription('')
  }

  const startEdit = (cat: any) => {
    setName(cat.name)
    setDescription(cat.description || '')
    setEditingId(cat._id)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Categories</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="stat-card">
            <h2 className="mb-4 font-semibold">{editingId ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Category name" required />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Description (optional)" rows={3} />
              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{editingId ? 'Update' : 'Add'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setName(''); setDescription('') }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>}
              </div>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2">
          {isLoading ? <p className="text-gray-500">Loading...</p> : (
            <div className="stat-card overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat: any) => (
                    <tr key={cat._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{cat.name}</td>
                      <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                      <td className="flex items-center gap-2 px-4 py-3">
                        <button onClick={() => startEdit(cat)} className="rounded p-1 hover:bg-gray-100"><Pencil className="h-4 w-4 text-gray-600" /></button>
                        <button onClick={() => { if (confirm('Delete?')) deleteCategory(cat._id) }} className="rounded p-1 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
