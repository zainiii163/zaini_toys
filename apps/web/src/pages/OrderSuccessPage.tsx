import { Link, useParams } from 'react-router-dom'
import { CheckCircle, Truck, Clock } from 'lucide-react'
import { useGetOrderByNumberQuery } from '../app/services/order'
import { formatDate } from '../lib/utils'

export default function OrderSuccessPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const { data: orderData, isLoading } = useGetOrderByNumberQuery(orderNumber || '', { skip: !orderNumber })

  if (isLoading) {
    return (
      <div className="container-toy py-12 animate-pulse">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gray-200" />
          <div className="h-8 w-64 mx-auto bg-gray-200 rounded" />
          <div className="mt-2 h-5 w-48 mx-auto bg-gray-200 rounded" />
          <div className="mt-1 h-5 w-32 mx-auto bg-gray-200 rounded" />
        </div>
        <div className="mt-8 max-w-2xl mx-auto space-y-4">
          <div className="card-toy p-6"><div className="h-32 bg-gray-200 rounded-xl" /></div>
          <div className="card-toy p-6"><div className="h-20 bg-gray-200 rounded-xl" /></div>
        </div>
      </div>
    )
  }
  if (!orderData?.success || !orderData.data) {
    return <div className="container-toy py-20 text-center">Order not found</div>
  }

  const order = orderData.data

  return (
    <div className="container-toy py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="mt-2 text-lg text-gray-600">Thank you for your order, {order.customerInfo.name}.</p>
        <p className="mt-1 text-blue-600 font-medium">Order #{order.orderNumber}</p>
      </div>

      <div className="mt-8 max-w-2xl mx-auto grid gap-4 sm:grid-cols-2">
        <Link to={`/orders/track/${order.orderNumber}`} className="card-toy p-4 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Track Your Order</p>
              <p className="text-sm text-gray-500">View real-time status</p>
            </div>
          </div>
        </Link>
        <Link to="/account/orders" className="card-toy p-4 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium">Order History</p>
              <p className="text-sm text-gray-500">View all past orders</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-8 max-w-2xl mx-auto">
        <div className="card-toy overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold">Order Summary</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span>Order Date</span>
              <span className="font-medium">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className="font-medium">
                {order.shippingMethod === 'standard' ? 'Standard (3-5 days)' : order.shippingMethod === 'express' ? 'Express (1-2 days)' : 'Same Day'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment</span>
              <span className="font-medium">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
              </span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Paid</span>
              <span>Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 card-toy p-6">
          <h3 className="font-semibold mb-3">Shipping Address</h3>
          <address className="text-sm text-gray-700 not-italic">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.address}<br />
            {order.shippingAddress.area}, {order.shippingAddress.city}<br />
            {order.shippingAddress.postalCode}<br />
            Phone: {order.shippingAddress.phone}
          </address>
        </div>

        <div className="mt-4 card-toy p-6">
          <h3 className="font-semibold mb-3">Items</h3>
          <ul className="space-y-3">
            {order.items.map((item: any) => (
              <li key={item._id} className="flex gap-3">
                <img src={item.productImage} alt={item.productName} className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  {item.variantName && <p className="text-sm text-gray-500">{item.variantName}</p>}
                  <p className="text-sm text-gray-600">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 max-w-2xl mx-auto text-center">
        <Link to="/shop" className="btn-primary inline-block">Continue Shopping</Link>
      </div>
    </div>
  )
}