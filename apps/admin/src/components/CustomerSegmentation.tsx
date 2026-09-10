import { useMemo } from 'react'
import { useGetOrdersQuery } from '../app/services/order'
import { useGetUsersQuery } from '../app/services/user'

const SPEND_TIERS = [
  { label: 'VIP (Rs. 50k+)', color: 'bg-purple-500', min: 50000 },
  { label: 'Regular (Rs. 10k–50k)', color: 'bg-blue-500', min: 10000 },
  { label: 'New (Rs. 1k–10k)', color: 'bg-green-500', min: 1000 },
  { label: 'One-time (< Rs. 1k)', color: 'bg-gray-400', min: 0 },
]

export default function CustomerSegmentation() {
  const { data: ordersData } = useGetOrdersQuery({ limit: '1000', sort: '-createdAt' })
  const { data: usersData } = useGetUsersQuery2({ limit: '100' })

  const segments = useMemo(() => {
    const orders = ordersData?.data || []
    const users = usersData?.data || []
    const totalOrders = orders.length

    const userSpending = new Map<string, number>()
    for (const order of orders) {
      if (order.status === 'cancelled') continue
      const key = order.customer || order.customerInfo?.email || 'unknown'
      userSpending.set(key, (userSpending.get(key) || 0) + (order.total || 0))
    }

    const stats = {
      vip: 0,
      regular: 0,
      new: 0,
      onetime: 0,
      totalRevenue: 0,
      totalCustomers: Math.min(users.length, 100),
      totalOrders,
    }

    userSpending.forEach((spend) => {
      stats.totalRevenue += spend
      if (spend >= 50000) stats.vip++
      else if (spend >= 10000) stats.regular++
      else if (spend >= 1000) stats.new++
      else stats.onetime++
    })

    // Add users who never ordered
    stats.onetime += Math.max(0, stats.totalCustomers - userSpending.size)

    return stats
  }, [ordersData, usersData])

  return (
    <div className="stat-card">
      <h3 className="mb-4 font-semibold">Customer Segmentation</h3>
      <div className="grid grid-cols-2 gap-4">
        {SPEND_TIERS.map((tier) => {
          const count = tier.label.startsWith('VIP') ? segments.vip :
            tier.label.startsWith('Regular') ? segments.regular :
            tier.label.startsWith('New') ? segments.new : segments.onetime
          return (
            <div key={tier.label} className="text-center">
              <div className="relative h-20 w-full overflow-hidden rounded-lg bg-gray-100">
                <div className={`absolute bottom-0 left-0 right-0 ${tier.color}`} style={{ height: `${Math.max(count / segments.totalCustomers * 100, 2)}%` }} />
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">{count}</span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-600">{tier.label}</p>
            </div>
          )
        })}
      </div>
      <div className="mt-4 space-y-1 text-xs text-gray-500">
        <p>Total Revenue: <span className="font-bold text-gray-700">Rs. {segments.totalRevenue.toLocaleString()}</span></p>
        <p>Total Customers: <span className="font-bold text-gray-700">{segments.totalCustomers}</span></p>
        <p>Total Orders: <span className="font-bold text-gray-700">{segments.totalOrders}</span></p>
      </div>
    </div>
  )
}
