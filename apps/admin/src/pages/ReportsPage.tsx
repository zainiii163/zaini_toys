import { useState } from 'react'
import { DollarSign, ShoppingCart, Users, TrendingUp, BarChart3, Package } from 'lucide-react'
import { useGetOrdersQuery } from '../app/services/order'
import { useGetUsersQuery } from '../app/services/user'
import { useGetProductsQuery } from '../app/services/product'

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const { data: ordersData } = useGetOrdersQuery({ limit: '100' })
  const { data: usersData } = useGetUsersQuery({ limit: '1' })
  const { data: productsData } = useGetProductsQuery({ limit: '100' })

  const orders = ordersData?.data || []
  const products = productsData?.data || []

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
  const totalOrders = orders.length
  const totalCustomers = usersData?.pagination?.total || 0
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const categoryMap: Record<string, number> = {}
  orders.forEach((order: any) => {
    order.items?.forEach((item: any) => {
      const category = item.category || 'Uncategorized'
      categoryMap[category] = (categoryMap[category] || 0) + (item.price || 0) * (item.quantity || 1)
    })
  })

  const productSales: Record<string, { name: string; sold: number; revenue: number }> = {}
  orders.forEach((order: any) => {
    order.items?.forEach((item: any) => {
      const key = item.productName || item._id
      if (!productSales[key]) {
        productSales[key] = { name: item.productName || 'Unknown', sold: 0, revenue: 0 }
      }
      productSales[key].sold += item.quantity || 1
      productSales[key].revenue += (item.price || 0) * (item.quantity || 1)
    })
  })
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const categoryBreakdown = Object.entries(categoryMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const inputClass = "rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

  const stats = [
    { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Customers', value: totalCustomers, icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Avg. Order Value', value: `Rs. ${Math.round(avgOrderValue).toLocaleString()}`, icon: TrendingUp, color: 'bg-amber-100 text-amber-600' },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Reports</h1>

      <div className="stat-card mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
          </div>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={inputClass}
          />
          <span className="text-sm text-gray-500">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

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
          <h2 className="mb-4 font-semibold">Revenue Chart</h2>
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
            <div className="text-center">
              <BarChart3 className="mx-auto mb-2 h-12 w-12 text-gray-300" />
              <p className="text-sm text-gray-500">Revenue visualization</p>
              <p className="text-lg font-bold text-gray-700">Rs. {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h2 className="mb-4 font-semibold">Top Selling Products</h2>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sold} sold</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold">Rs. {product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">No product sales data</p>
          )}
        </div>

        <div className="stat-card">
          <h2 className="mb-4 font-semibold">Sales by Category</h2>
          {categoryBreakdown.length > 0 ? (
            <div className="space-y-3">
              {categoryBreakdown.map(([category, revenue], idx) => {
                const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0
                return (
                  <div key={idx}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-gray-600">Rs. {revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">No category data available</p>
          )}
        </div>

        <div className="stat-card">
          <h2 className="mb-4 font-semibold">Product Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Total Products</span>
              </div>
              <span className="text-lg font-bold">{products.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Completed Orders</span>
              </div>
              <span className="text-lg font-bold">{orders.filter((o: any) => o.status === 'delivered').length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium">Total Discounts</span>
              </div>
              <span className="text-lg font-bold">Rs. {orders.reduce((sum: number, o: any) => sum + (o.discount || 0), 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
