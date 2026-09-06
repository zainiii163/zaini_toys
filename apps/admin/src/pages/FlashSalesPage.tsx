import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useGetFlashSalesQuery, useCreateFlashSaleMutation, useDeleteFlashSaleMutation } from '../app/services/flashSale'
import { formatDate } from '../lib/utils'

export default function FlashSalesPage() {
  const { data, isLoading } = useGetFlashSalesQuery()
  const [createFlashSale] = useCreateFlashSaleMutation()
  const [deleteFlashSale] = useDeleteFlashSaleMutation()
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const sales = data?.data || []
  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !startDate || !endDate) return
    await createFlashSale({ name, startDate, endDate, isActive: true, products: [] })
    setName('')
    setStartDate('')
    setEndDate('')
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Flash Sales</h1>
      <div className="stat-card mb-6">
        <h2 className="mb-4 font-semibold">Create Flash Sale</h2>
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-4">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Sale name" required />
          <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} required />
          <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} required />
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"><Plus className="mr-1 inline h-4 w-4" /> Create</button>
        </form>
      </div>

      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="stat-card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Start</th>
                <th className="px-4 py-3 font-medium">End</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.map((s: any) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{s.products?.length || 0}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(s.startDate)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(s.endDate)}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3"><button onClick={() => { if (confirm('Delete?')) deleteFlashSale(s._id) }} className="rounded p-1 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {sales.length === 0 && <p className="py-6 text-center text-gray-500">No flash sales yet.</p>}
        </div>
      )}
    </div>
  )
}
