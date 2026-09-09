import { useState } from 'react'
import { XCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  order: any
  onCancelled?: () => void
}

export default function OrderCancelButton({ order, onCancelled }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [reason, setReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  const canCancel = ['pending', 'confirmed'].includes(order.status)

  if (!canCancel) return null

  const onCancel = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for cancellation')
      return
    }
    setCancelling(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Order cancelled successfully. Refund will be processed within 5-7 business days.')
    setShowConfirm(false)
    setCancelling(false)
    onCancelled?.()
  }

  return (
    <div className="mt-4">
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          <XCircle className="h-4 w-4" /> Cancel Order
        </button>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Cancel Order #{order.orderNumber}?</h3>
              <p className="mt-1 text-sm text-red-600">This action cannot be undone. Refund will be processed within 5-7 business days.</p>
              <div className="mt-3">
                <label className="mb-1 block text-sm font-medium">Reason for cancellation *</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-lg border border-red-300 p-2 text-sm" required>
                  <option value="">Select reason</option>
                  <option value="changed_mind">Changed my mind</option>
                  <option value="found_better_price">Found a better price elsewhere</option>
                  <option value="ordered_wrong">Ordered wrong item</option>
                  <option value="too_long_delivery">Delivery taking too long</option>
                  <option value="no_longer_needed">No longer needed</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={onCancel} disabled={cancelling || !reason} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
                <button onClick={() => setShowConfirm(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Keep Order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
