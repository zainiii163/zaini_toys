import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useGetBrandsQuery, useCreateBrandMutation, useUpdateBrandMutation, useDeleteBrandMutation } from '../app/services/brand'

export default function BrandsPage() {
  const { data, isLoading } = useGetBrandsQuery()
  const [createBrand] = useCreateBrandMutation()
  const [updateBrand] = useUpdateBrandMutation()
  const [deleteBrand] = useDeleteBrandMutation()
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const brands = data?.data || []

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    if (editingId) {
      await updateBrand({ id: editingId, body: { name } })
      setEditingId(null)
    } else {
      await createBrand({ name })
    }
    setName('')
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Brands</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="stat-card">
            <h2 className="mb-4 font-semibold">{editingId ? 'Edit Brand' : 'Add Brand'}</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Brand name" required />
              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{editingId ? 'Update' : 'Add'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setName('') }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>}
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
                  {brands.map((b: any) => (
                    <tr key={b._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{b.name}</td>
                      <td className="px-4 py-3 text-gray-500">{b.slug}</td>
                      <td className="flex items-center gap-2 px-4 py-3">
                        <button onClick={() => { setEditingId(b._id); setName(b.name) }} className="rounded p-1 hover:bg-gray-100"><Pencil className="h-4 w-4 text-gray-600" /></button>
                        <button onClick={() => { if (confirm('Delete?')) deleteBrand(b._id) }} className="rounded p-1 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></button>
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
