import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useGetCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from '../app/services/coupon'
import { formatDate } from '../lib/utils'

export default function CouponsPage() {
  const { data, isLoading } = useGetCouponsQuery({ page: '1', limit: '50' })
  const [createCoupon] = useCreateCouponMutation()
  const [updateCoupon] = useUpdateCouponMutation()
  const [deleteCoupon] = useDeleteCouponMutation()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ code: '', description: '', discountType: 'percentage' as 'percentage' | 'fixed', discountValue: '', minPurchase: '', maxDiscount: '', usageLimit: '', expiresAt: '' })

  const coupons = data?.data || []
  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body: any = { ...form, discountValue: Number(form.discountValue), minPurchase: Number(form.minPurchase) || 0, maxDiscount: Number(form.maxDiscount) || undefined, usageLimit: Number(form.usageLimit) || 0 }
    if (editingId) {
      await updateCoupon({ id: editingId, body })
      setEditingId(null)
    } else {
      await createCoupon(body)
    }
    setForm({ code: '', description: '', discountType: 'percentage', discountValue: '', minPurchase: '', maxDiscount: '', usageLimit: '', expiresAt: '' })
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Coupons</h1>
      <div className="stat-card mb-6">
        <h2 className="mb-4 font-semibold">{editingId ? 'Edit Coupon' : 'Create Coupon'}</h2>
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className={inputClass} placeholder="Code" required />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} placeholder="Description" />
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as any })} className={inputClass}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className={inputClass} placeholder="Discount Value" required min="0" />
          <input type="number" value={form.minPurchase} onChange={(e) => setForm({ ...form, minPurchase: e.target.value })} className={inputClass} placeholder="Min Purchase" min="0" />
          <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} className={inputClass} placeholder="Max Discount" min="0" />
          <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className={inputClass} placeholder="Usage Limit" min="0" />
          <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inputClass} />
          <div className="sm:col-span-2 lg:col-span-4 flex gap-2">
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ code: '', description: '', discountType: 'percentage', discountValue: '', minPurchase: '', maxDiscount: '', usageLimit: '', expiresAt: '' }) }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>}
          </div>
        </form>
      </div>

      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="stat-card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Used</th>
                <th className="px-4 py-3 font-medium">Expires</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c: any) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                  <td className="px-4 py-3">{c.discountType === 'percentage' ? `${c.discountValue}%` : `Rs. ${c.discountValue}`}</td>
                  <td className="px-4 py-3">{c.usedCount}/{c.usageLimit || '∞'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.expiresAt ? formatDate(c.expiresAt) : 'Never'}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="flex items-center gap-2 px-4 py-3">
                    <button onClick={() => { setEditingId(c._id); setForm({ code: c.code, description: c.description || '', discountType: c.discountType, discountValue: String(c.discountValue), minPurchase: String(c.minPurchase || ''), maxDiscount: String(c.maxDiscount || ''), usageLimit: String(c.usageLimit || ''), expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '' }) }} className="rounded p-1 hover:bg-gray-100"><Pencil className="h-4 w-4 text-gray-600" /></button>
                    <button onClick={() => { if (confirm('Delete?')) deleteCoupon(c._id) }} className="rounded p-1 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
