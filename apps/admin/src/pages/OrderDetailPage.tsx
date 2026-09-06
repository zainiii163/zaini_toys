import { useParams, useNavigate } from 'react-router-dom'
import { useGetOrderByNumberQuery, useUpdateOrderStatusMutation } from '../app/services/order'
import { formatDate } from '../lib/utils'

const STATUSES = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useGetOrderByNumberQuery(id || '', { skip: !id })
  const [updateStatus] = useUpdateOrderStatusMutation()

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  const order = data?.data
  if (!order) return <p className="text-gray-500">Order not found</p>

  const handleStatusChange = async (status: string) => {
    await updateStatus({ id: order._id, status })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
        <button onClick={() => navigate('/orders')} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Back</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="stat-card">
            <h2 className="mb-4 font-semibold">Items</h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any) => (
                <div key={item._id} className="flex items-center gap-4 py-3">
                  <img src={item.productImage} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <p className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-Rs. {order.discount.toLocaleString()}</span></div>}
              <div className="flex justify-between text-sm"><span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `Rs. ${order.shippingCost.toLocaleString()}`}</span></div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2"><span>Total</span><span>Rs. {order.total.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="stat-card">
            <h2 className="mb-4 font-semibold">Shipping Address</h2>
            <address className="text-sm not-italic text-gray-700">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.area}, {order.shippingAddress.city}<br />
              Phone: {order.shippingAddress.phone}
            </address>
          </div>
        </div>

        <div className="space-y-6">
          <div className="stat-card">
            <h2 className="mb-4 font-semibold">Customer</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> {order.customerInfo.name}</p>
              <p><span className="text-gray-500">Email:</span> {order.customerInfo.email}</p>
              <p><span className="text-gray-500">Phone:</span> {order.customerInfo.phone}</p>
            </div>
          </div>

          <div className="stat-card">
            <h2 className="mb-4 font-semibold">Payment</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Method:</span> {order.paymentMethod}</p>
              <p><span className="text-gray-500">Status:</span>
                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>

          <div className="stat-card">
            <h2 className="mb-4 font-semibold">Update Status</h2>
            <select defaultValue={order.status} onChange={(e) => handleStatusChange(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <p className="mt-2 text-xs text-gray-500">Created: {formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
