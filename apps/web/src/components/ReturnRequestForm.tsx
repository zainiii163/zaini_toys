import { useState } from 'react'
import { Package, AlertTriangle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppSelector } from '../hooks/typed'

interface Props {
  order: any
  onSubmitted?: () => void
}

export default function ReturnRequestForm({ order, onSubmitted }: Props) {
  const auth = useAppSelector((s) => s.auth)
  const [showForm, setShowForm] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const eligible = order.status === 'delivered'
  const returnWindow = 7
  const deliveredDate = order.statusHistory?.find((h: any) => h.status === 'delivered')?.timestamp
  const isWithinReturnWindow = deliveredDate
    ? (Date.now() - new Date(deliveredDate).getTime()) / (1000 * 60 * 60 * 24) <= returnWindow
    : false

  if (!eligible || !isWithinReturnWindow) return null

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedItems.length === 0) { toast.error('Select at least one item'); return }
    if (!reason) { toast.error('Please select a reason'); return }
    setSubmitting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Return request submitted! We will review within 24 hours.')
    setShowForm(false)
    setSelectedItems([])
    setReason('')
    setDescription('')
    setSubmitting(false)
    onSubmitted?.()
  }

  return (
    <div className="mt-4">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
        >
          <Package className="h-4 w-4" /> Request Return/Refund
        </button>
      ) : (
        <form onSubmit={onSubmit} className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <h3 className="mb-3 font-semibold text-orange-800">Return/Refund Request</h3>
          <p className="mb-3 text-xs text-orange-600">Select items you want to return and provide a reason.</p>

          <div className="mb-3 space-y-2">
            {order.items?.map((item: any) => (
              <label key={item._id || item.product} className="flex items-center gap-3 rounded-lg bg-white p-2 border border-orange-200 cursor-pointer hover:bg-orange-50">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id || item.product)}
                  onChange={() => toggleItem(item._id || item.product)}
                  className="rounded"
                />
                <img src={item.productImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.productName || 'Product'}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} • Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-sm font-medium">Reason *</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-lg border border-orange-300 p-2 text-sm" required>
              <option value="">Select reason</option>
              <option value="wrong_item">Wrong item received</option>
              <option value="damaged">Item damaged/defective</option>
              <option value="not_as_described">Not as described</option>
              <option value="changed_mind">Changed my mind</option>
              <option value="size_issue">Size/fit issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Additional details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-orange-300 p-2 text-sm"
              placeholder="Describe the issue..."
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50">
              <Send className="h-4 w-4" /> {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}
