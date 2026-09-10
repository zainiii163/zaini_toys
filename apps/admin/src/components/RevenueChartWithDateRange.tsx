import { useMemo, useState } from 'react'
import { useGetOrdersQuery } from '../app/services/order'

export default function RevenueChartWithDateRange() {
  const { data: ordersData } = useGetOrdersQuery({ limit: '500', sort: '-createdAt' })
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  const trend = useMemo(() => {
    const orders = ordersData?.data || []
    const now = new Date()
    const days: { label: string; revenue: number; orders: number }[] = []

    const daysToShow = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToShow)

    for (let i = daysToShow; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      days.push({ label, revenue: 0, orders: 0 })
    }

    for (const order of orders) {
      if (order.status === 'cancelled') continue
      const orderDate = new Date(order.createdAt)
      if (orderDate >= startDate) {
        const key = orderDate.toISOString().slice(0, 10)
        const day = days.find((d) => new Date(d.label + ' ' + now.getFullYear()).toISOString().slice(0, 10) === key)
        if (day) {
          day.revenue += order.total || 0
          day.orders += 1
        }
      }
    }

    return days
  }, [ordersData, dateRange])

  const totalRevenue = trend.reduce((s, d) => s + d.revenue, 0)
  const totalOrders = trend.reduce((s, d) => s + d.orders, 0)
  const avgDaily = totalRevenue / trend.length

  const maxVal = Math.max(...trend.map((d) => d.revenue), 1)
  const width = 600
  const height = 180
  const padding = 30

  const points = trend.map((d, i) => {
    const x = padding + (i / (trend.length - 1)) * (width - padding * 2)
    const y = height - padding - (d.revenue / maxVal) * (height - padding * 2)
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="stat-card">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold">Revenue Overview</h3>
          <p className="text-xs text-gray-500">Rs. {totalRevenue.toLocaleString()} | {totalOrders} orders | Avg: Rs. {Math.round(avgDaily).toLocaleString()}/day</p>
        </div>
        <div className="flex gap-1">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`rounded-lg px-2 py-1 text-xs font-medium ${
                dateRange === range ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === 'all' ? 'All' : range}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Y-axis grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <g key={i}>
            <line x1={padding} y1={height - padding - pct * (height - padding * 2)} x2={width - padding} y2={height - padding - pct * (height - padding * 2)} stroke="#f3f4f6" strokeWidth="1" />
            <text x={padding - 4} y={height - padding - pct * (height - padding * 2) + 4} textAnchor="end" fontSize="8" fill="#9ca3af">
              Rs. {Math.round(maxVal * pct / 1000)}k
            </text>
          </g>
        ))}

        <path d={`${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`} fill="url(#revGradient)" opacity="0.2" />
        <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {points.filter((_, i) => i % Math.max(Math.floor(points.length / 7), 1) === 0 || i === points.length - 1).map((p, i) => (
          <text key={i} x={p.x} y={height - 8} textAnchor="middle" fontSize="7" fill="#9ca3af">{p.label}</text>
        ))}

        <defs>
          <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
