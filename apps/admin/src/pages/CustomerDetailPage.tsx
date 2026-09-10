import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Package, Star, ShoppingBag } from 'lucide-react'

const API = '/api/v1'

interface Customer {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  loyaltyPoints: number
  loyaltyTier: string
  createdAt: string
  addresses?: any[]
}

interface Order {
  _id: string
  orderNumber: string
  total: number
  status: string
  items: any[]
  createdAt: string
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const [custRes, ordersRes] = await Promise.all([
          fetch(`${API}/admin/users/${id}`).then((r) => r.json()),
          fetch(`${API}/orders?user=${id}&limit=50`).then((r) => r.json()),
        ])
        setCustomer(custRes.data)
        setOrders(ordersRes.data || [])
      } catch {}
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div>
        <div className="mb-6 h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="stat-card h-64 bg-gray-100 animate-pulse" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Customer not found.</p>
        <Link to="/customers" className="btn-primary mt-4 inline-block text-sm">Back to Customers</Link>
      </div>
    )
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length

  return (
    <div>
      <Link to="/customers" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" /> Back to Customers
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Info */}
        <div className="stat-card lg:col-span-1">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
              {customer.name?.[0]?.toUpperCase() || '?'}
            </div>
            <h1 className="mt-3 text-xl font-bold">{customer.name}</h1>
            <span className="mt-1 inline-block rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium capitalize">{customer.role}</span>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{customer.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-center">
              <p className="text-lg font-bold text-blue-600">{customer.loyaltyPoints || 0}</p>
              <p className="text-xs text-gray-500">Loyalty Points</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-center">
              <p className="text-lg font-bold text-amber-600 capitalize">{customer.loyaltyTier || 'bronze'}</p>
              <p className="text-xs text-gray-500">Tier</p>
            </div>
          </div>
        </div>

        {/* Orders + Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="stat-card text-center">
              <ShoppingBag className="mx-auto h-6 w-6 text-blue-600" />
              <p className="mt-1 text-2xl font-bold">{totalOrders}</p>
              <p className="text-xs text-gray-500">Total Orders</p>
            </div>
            <div className="stat-card text-center">
              <Package className="mx-auto h-6 w-6 text-green-600" />
              <p className="mt-1 text-2xl font-bold">{deliveredOrders}</p>
              <p className="text-xs text-gray-500">Delivered</p>
            </div>
            <div className="stat-card text-center">
              <Star className="mx-auto h-6 w-6 text-amber-600" />
              <p className="mt-1 text-2xl font-bold">Rs. {totalSpent.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Spent</p>
            </div>
          </div>

          {/* Orders */}
          <div className="stat-card">
            <h2 className="mb-4 font-semibold">Order History</h2>
            {orders.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                      <th className="pb-2 font-medium">Order</th>
                      <th className="pb-2 font-medium">Items</th>
                      <th className="pb-2 font-medium">Total</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="py-2.5">
                          <Link to={`/orders/${order._id}`} className="font-medium text-blue-600 hover:underline">#{order.orderNumber}</Link>
                        </td>
                        <td className="py-2.5 text-gray-600">{order.items?.length || 0} item(s)</td>
                        <td className="py-2.5 font-semibold">Rs. {order.total.toLocaleString()}</td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>{order.status.replace('_', ' ')}</span>
                        </td>
                        <td className="py-2.5 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Addresses */}
          {customer.addresses && customer.addresses.length > 0 && (
            <div className="stat-card">
              <h2 className="mb-4 font-semibold">Addresses</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {customer.addresses.map((addr: any, i: number) => (
                  <div key={i} className="rounded-xl border border-gray-200 p-3">
                    <p className="font-medium text-sm">{addr.label || `Address ${i + 1}`}</p>
                    <p className="mt-1 text-xs text-gray-600">{addr.fullName}</p>
                    <p className="text-xs text-gray-500">{addr.street}</p>
                    <p className="text-xs text-gray-500">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-xs text-gray-500">{addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
