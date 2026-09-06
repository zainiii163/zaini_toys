import { Link, useParams } from 'react-router-dom'
import { Truck, MapPin, CheckCircle, Package, AlertCircle } from 'lucide-react'
import { useGetOrderByNumberQuery } from '../app/services/order'
import { formatDate } from '../lib/utils'

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Truck },
  { key: 'packed', label: 'Packed', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
]

export default function OrderTrackingPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const { data: orderData, isLoading } = useGetOrderByNumberQuery(orderNumber || '', { skip: !orderNumber })

  if (isLoading) {
    return (
      <div className="container-toy py-8 animate-pulse">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 h-8 w-64 bg-gray-200 rounded" />
          <div className="relative mb-8 flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200" />
                <div className="mt-2 h-3 w-12 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
          <div className="card-toy p-6"><div className="h-48 bg-gray-200 rounded-xl" /></div>
        </div>
      </div>
    )
  }
  if (!orderData?.success || !orderData.data) {
    return (
      <div className="container-toy py-20 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-gray-300" />
        <h2 className="mt-4 font-display text-xl font-semibold">Order not found</h2>
        <p className="mt-2 text-gray-500">Please check the order number and try again.</p>
        <Link to="/account/orders" className="btn-primary mt-4 inline-block">My Orders</Link>
      </div>
    )
  }

  const order = orderData.data
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === order.status)
  const statusHistory = order.statusHistory || []

  return (
    <div className="container-toy py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Track Order #{order.orderNumber}</h1>
            <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <Link to="/account/orders" className="text-sm text-blue-600 hover:underline">← Back to Orders</Link>
        </div>

        {/* Progress */}
        <div className="relative mb-8">
          <div className="absolute left-1/2 top-6 h-1 w-full -translate-x-1/2 bg-gray-200" />
          <div className="relative flex items-center justify-between">
            {STATUS_STEPS.map((step, i) => (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                    i <= currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <step.icon className="h-6 w-6" />
                </div>
                <p className="mt-2 text-xs text-center text-gray-600">{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="card-toy overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold">Order Timeline</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {statusHistory.map((h: any, i: number) => (
              <div key={i} className="relative pl-6 py-4 sm:pl-10">
                <div className="absolute left-0 top-4 h-4 w-4 rounded-full bg-blue-500 sm:left-3" />
                {i < statusHistory.length - 1 && (
                  <div className="absolute left-1.5 top-8 h-full w-0.5 bg-gray-200 sm:left-4" />
                )}
                <p className="text-sm font-medium text-gray-900">{h.status.replace('_', ' ').toUpperCase()}</p>
                <p className="text-sm text-gray-500">{formatDate(h.timestamp)}</p>
                {h.note && <p className="text-sm text-blue-600">{h.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="card-toy p-6">
            <h3 className="font-semibold mb-3">Shipping Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Method</dt><dd className="font-medium">{order.shippingMethod === 'standard' ? 'Standard' : order.shippingMethod === 'express' ? 'Express' : 'Same Day'}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Estimated Delivery</dt><dd className="font-medium">{order.estimatedDelivery ? formatDate(order.estimatedDelivery) : '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Courier</dt><dd className="font-medium">{order.courierService || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Tracking #</dt><dd className="font-medium">{order.trackingNumber || '—'}</dd></div>
            </dl>
          </div>
          <div className="card-toy p-6">
            <h3 className="font-semibold mb-3">Shipping Address</h3>
            <address className="text-sm text-gray-700 not-italic">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.area}, {order.shippingAddress.city}<br />
              {order.shippingAddress.postalCode}<br />
              Phone: {order.shippingAddress.phone}
            </address>
          </div>
        </div>
      </div>
    </div>
  )
}