import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Mail, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useGetOrderByNumberQuery, useUpdateOrderStatusMutation } from '../app/services/order'
import { useGetMyOrdersQuery } from '../app/services/order'
import toast from 'react-hot-toast'
import OrderCancelButton from '../components/OrderCancelButton'
import InvoiceDownload from '../components/InvoiceDownload'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useGetOrderByNumberQuery(id || '', { skip: !id })
  const [updateStatus] = useUpdateOrderStatusMutation()
  const [notes, setNotes] = useState('')
  const [orderNotes, setOrderNotes] = useState<string[]>([])

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  const order = data?.data
  if (!order) return <p className="text-gray-500">Order not found</p>

  const handleStatusChange = async (status: string) => {
    await updateStatus({ id: order._id, status })
    toast.success(`Status updated to ${status}`)
  }

  const handleAddNote = async () => {
    if (!notes.trim()) return
    setOrderNotes([...orderNotes, `${new Date().toLocaleString()}: ${notes}`])
    setNotes('')
    toast.success('Note added')
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <InvoiceDownload order={order} />
          <Link to="/orders" className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Back</Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="stat-card">
            <h2 className="mb-4 font-semibold">Order Status</h2>
            <div className="flex flex-wrap gap-2">
              {['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'].map((status) => {
                const isActive = order.status === status
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="stat-card">
            <h2 className="mb-4 font-semibold">Order Items ({order.items?.length})</h2>
            <div className="space-y-3">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 border-b border-gray-100 pb-3">
                  <img src={item.productImage} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × Rs. {(item.price || 0).toLocaleString()}</p>
                  </div>
                  <span className="font-bold">Rs. {(item.total || item.price * item.quantity)?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="stat-card">
            <h2 className="mb-4 font-semibold">Order Notes ({orderNotes.length})</h2>
            <div className="space-y-2 mb-3">
              {orderNotes.map((note, i) => (
                <div key={i} className="rounded-lg bg-gray-50 p-3 text-sm">{note}</div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note..."
                className="input-toy flex-1"
              />
              <button onClick={handleAddNote} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Add</button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="stat-card">
            <h2 className="mb-3 font-semibold">Customer</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> {order.customerInfo?.name || 'N/A'}</p>
              <p><span className="text-gray-500">Email:</span> {order.customerInfo?.email || 'N/A'}</p>
              <p><span className="text-gray-500">Phone:</span> {order.customerInfo?.phone || 'N/A'}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="stat-card">
            <h2 className="mb-3 font-semibold">Payment</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Method:</span> {(order.paymentMethod || 'cod').toUpperCase()}</p>
              <p><span className="text-gray-500">Status:</span> <span className="capitalize text-green-600">{order.paymentStatus || 'pending'}</span></p>
              <p><span className="text-gray-500">Total:</span> <span className="font-bold">Rs. {order.total?.toLocaleString()}</span></p>
              {order.discount && order.discount > 0 && <p className="text-green-600">Discount: -Rs. {order.discount?.toLocaleString()}</p>}
            </div>
          </div>

          {/* Shipping */}
          <div className="stat-card">
            <h2 className="mb-3 font-semibold">Shipping</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Method:</span> {(order.shippingMethod || 'standard').replace('_', ' ')}</p>
              <p><span className="text-gray-500">Cost:</span> Rs. {(order.shippingCost || 0)?.toLocaleString()}</p>
              {order.shippingAddress && (
                <div>
                  <p className="text-gray-500">Address:</p>
                  <p className="text-xs">{order.shippingAddress.address}, {order.shippingAddress.area}, {order.shippingAddress.city}</p>
                  <p className="text-xs">{order.shippingAddress.fullName} - {order.shippingAddress.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <OrderCancelButton order={order} />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Last updated: {new Date(order.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
