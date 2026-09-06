import { Link } from 'react-router-dom'
import { useGetOrdersQuery } from '../app/services/order'
import { useGetUsersQuery } from '../app/services/user'
import { useGetProductsQuery } from '../app/services/product'
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react'

export default function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({ limit: '5', sort: '-createdAt' })
  const { data: usersData } = useGetUsersQuery({ limit: '1' })
  const { data: productsData } = useGetProductsQuery({ limit: '1' })

  const stats = [
    { label: 'Total Orders', value: ordersData?.pagination?.total || 0, icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { label: 'Revenue', value: `Rs. ${(ordersData?.data?.reduce((sum: number, o: any) => sum + o.total, 0) || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Products', value: productsData?.pagination?.total || 0, icon: Package, color: 'bg-purple-100 text-purple-600' },
    { label: 'Customers', value: usersData?.pagination?.total || 0, icon: Users, color: 'bg-amber-100 text-amber-600' },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="stat-card">
          <h2 className="mb-4 font-semibold">Recent Orders</h2>
          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {ordersData?.data?.slice(0, 5).map((order: any) => (
                <div key={order._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customerInfo?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">Rs. {order.total?.toLocaleString()}</p>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))}
              {(!ordersData?.data || ordersData.data.length === 0) && <p className="py-6 text-center text-sm text-gray-500">No orders yet</p>}
            </div>
          )}
        </div>
        <div className="stat-card">
          <h2 className="mb-4 font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/products/new" className="rounded-xl border border-gray-200 p-4 text-center hover:bg-gray-50">
              <Package className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <p className="text-sm font-medium">Add Product</p>
            </Link>
            <Link to="/orders" className="rounded-xl border border-gray-200 p-4 text-center hover:bg-gray-50">
              <ShoppingCart className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <p className="text-sm font-medium">View Orders</p>
            </Link>
            <Link to="/categories" className="rounded-xl border border-gray-200 p-4 text-center hover:bg-gray-50">
              <Package className="mx-auto mb-2 h-8 w-8 text-purple-600" />
              <p className="text-sm font-medium">Categories</p>
            </Link>
            <Link to="/coupons" className="rounded-xl border border-gray-200 p-4 text-center hover:bg-gray-50">
              <DollarSign className="mx-auto mb-2 h-8 w-8 text-amber-600" />
              <p className="text-sm font-medium">Coupons</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
