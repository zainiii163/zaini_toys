import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useGetOrdersQuery } from '../app/services/order'

export default function TopCustomersChart() {
  const { data: ordersData } = useGetOrdersQuery({ limit: '500', sort: '-createdAt' })

  const topCustomers = useMemo(() => {
    const orders = ordersData?.data || []
    const customers: Record<string, { name: string; email: string; total: number; orders: number }> = {}

    for (const order of orders) {
      if (order.status === 'cancelled') continue
      const key = order.customer || order.customerInfo?.email || 'unknown'
      if (!customers[key]) {
        customers[key] = {
          name: order.customerInfo?.name || 'Customer',
          email: order.customerInfo?.email || '',
          total: 0,
          orders: 0,
        }
      }
      customers[key].total += order.total || 0
      customers[key].orders += 1
    }

    return Object.values(customers)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }, [ordersData])

  const maxRevenue = Math.max(...topCustomers.map((c) => c.total), 1)

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Top Customers</h3>
      </div>

      {topCustomers.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No customer data yet.</p>
      ) : (
        <div className="space-y-3">
          {topCustomers.map((c, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{c.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900">Rs. {c.total.toLocaleString()}</span>
                  <span className="ml-2 text-xs text-gray-500">{c.orders} orders</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${(c.total / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
