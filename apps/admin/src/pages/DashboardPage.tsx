import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetOrdersQuery } from '../app/services/order'
import { useGetUsersQuery } from '../app/services/user'
import { useGetProductsQuery } from '../app/services/product'
import { useGetCategoriesQuery } from '../app/services/category'
import { useGetCouponsQuery } from '../app/services/coupon'
import { DollarSign, ShoppingCart, Package, Users, AlertTriangle, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, RotateCcw } from 'lucide-react'
import SalesByCategoryChart from '../components/SalesByCategoryChart'
import SalesTrendChart from '../components/SalesTrendChart'
import TopCustomersChart from '../components/TopCustomersChart'
import CustomerSegmentation from '../components/CustomerSegmentation'
import RevenueChartWithDateRange from '../components/RevenueChartWithDateRange'

export default function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({ limit: '10', sort: '-createdAt' })
  const { data: usersData } = useGetUsersQuery({ limit: '1' })
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ limit: '50' })
  const { data: categoriesData } = useGetCategoriesQuery()
  const { data: couponsData } = useGetCouponsQuery()

  const orders = ordersData?.data || []
  const products = productsData?.data || []

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
  const pendingOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'confirmed')
  const deliveredOrders = orders.filter((o: any) => o.status === 'delivered')
  const lowStockProducts = products.filter((p: any) => (p.availableStock || 0) <= 5 && (p.availableStock || 0) > 0)
  const outOfStockProducts = products.filter((p: any) => (p.availableStock || 0) === 0)
  const todayOrders = orders.filter((o: any) => {
    const today = new Date().toDateString()
    return new Date(o.createdAt).toDateString() === today
  })

  const [statusFilter, setStatusFilter] = useState('all')
  const filteredOrders = statusFilter === 'all' ? orders : orders.filter((o: any) => o.status === statusFilter)

  const stats = [
    {
      label: 'Total Revenue',
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      change: '+12%',
      up: true,
    },
    {
      label: 'Total Orders',
      value: ordersData?.pagination?.total || orders.length,
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-600',
      change: `${todayOrders.length} today`,
      up: true,
    },
    {
      label: 'Products',
      value: productsData?.pagination?.total || products.length,
      icon: Package,
      color: 'bg-purple-100 text-purple-600',
      change: `${outOfStockProducts.length} out of stock`,
      up: false,
    },
    {
      label: 'Customers',
      value: usersData?.pagination?.total || 0,
      icon: Users,
      color: 'bg-amber-100 text-amber-600',
      change: 'All time',
      up: true,
    },
  ]

  const secondaryStats = [
    { label: 'Pending Orders', value: pendingOrders.length, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Delivered', value: deliveredOrders.length, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Low Stock', value: lowStockProducts.length, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Out of Stock', value: outOfStockProducts.length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Categories', value: categoriesData?.data?.length || 0, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Coupons', value: couponsData?.data?.length || 0, icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700',
    packed: 'bg-purple-100 text-purple-700',
    shipped: 'bg-cyan-100 text-cyan-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    returned: 'bg-gray-100 text-gray-700',
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Primary stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
            <div className={`text-xs font-medium ${s.up ? 'text-green-600' : 'text-red-600'}`}>
              {s.up ? <ArrowUpRight className="inline h-3 w-3" /> : <ArrowDownRight className="inline h-3 w-3" />}
              {' '}{s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="mb-6 grid gap-3 grid-cols-3 sm:grid-cols-6">
        {secondaryStats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-3 text-center">
            <div className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sales Trend */}
      <RevenueChartWithDateRange />
      <SalesTrendChart />

      {/* Order Filter + Recent Orders + Sidebar */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="stat-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link to="/orders" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="mb-3 flex items-center gap-2">
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
              <button key={status} className={`rounded-lg px-2 py-1 text-xs font-medium ${
                statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`} onClick={() => setStatusFilter(status)}>
                {status === 'all' ? 'All' : status.replace('_', ' ')}
              </button>
            ))}
          </div>
          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                    <th className="pb-2 font-medium">Order</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.slice(0, 8).map((order: any) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="py-2.5 font-medium">#{order.orderNumber}</td>
                      <td className="py-2.5 text-gray-600">{order.customerInfo?.name || 'Guest'}</td>
                      <td className="py-2.5 font-semibold">Rs. {order.total?.toLocaleString()}</td>
                      <td className="py-2.5">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <p className="py-6 text-center text-sm text-gray-500">No orders yet</p>}
            </div>
          )}
        </div>

        {/* Sales by Category + Top Customers + Quick Actions */}
        <div className="space-y-6">
          <SalesByCategoryChart />
          <TopCustomersChart />
          <CustomerSegmentation />

          {/* Quick Actions */}
          <div className="stat-card">
            <h2 className="mb-4 font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/products/new" className="rounded-xl border border-gray-200 p-3 text-center hover:bg-gray-50">
                <Package className="mx-auto mb-1 h-6 w-6 text-blue-600" />
                <p className="text-xs font-medium">Add Product</p>
              </Link>
              <Link to="/orders" className="rounded-xl border border-gray-200 p-3 text-center hover:bg-gray-50">
                <ShoppingCart className="mx-auto mb-1 h-6 w-6 text-green-600" />
                <p className="text-xs font-medium">Orders</p>
              </Link>
              <Link to="/returns" className="rounded-xl border border-gray-200 p-3 text-center hover:bg-gray-50">
                <RotateCcw className="mx-auto mb-1 h-6 w-6 text-orange-600" />
                <p className="text-xs font-medium">Returns</p>
              </Link>
              <Link to="/coupons" className="rounded-xl border border-gray-200 p-3 text-center hover:bg-gray-50">
                <DollarSign className="mx-auto mb-1 h-6 w-6 text-amber-600" />
                <p className="text-xs font-medium">Coupons</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
