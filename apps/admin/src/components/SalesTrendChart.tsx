import { useMemo } from 'react'
import { useGetOrdersQuery } from '../app/services/order'

export default function SalesTrendChart() {
  const { data: ordersData } = useGetOrdersQuery({ limit: '500', sort: '-createdAt' })

  const trend = useMemo(() => {
    const orders = ordersData?.data || []
    const now = new Date()
    const days: { date: string; label: string; revenue: number }[] = []

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      days.push({ date: key, label, revenue: 0 })
    }

    for (const order of orders) {
      if (order.status === 'cancelled') continue
      const key = new Date(order.createdAt).toISOString().slice(0, 10)
      const day = days.find((d) => d.date === key)
      if (day) day.revenue += order.total || 0
    }

    return days
  }, [ordersData])

  const maxVal = Math.max(...trend.map((d) => d.revenue), 1)
  const totalRevenue = trend.reduce((s, d) => s + d.revenue, 0)
  const avgDaily = totalRevenue / 30

  // Simple SVG line chart
  const width = 600
  const height = 160
  const padding = 30

  const points = trend.map((d, i) => {
    const x = padding + (i / (trend.length - 1)) * (width - padding * 2)
    const y = height - padding - (d.revenue / maxVal) * (height - padding * 2)
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

  // Y-axis labels
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    y: height - padding - pct * (height - padding * 2),
    label: `Rs. ${Math.round(maxVal * pct / 1000)}k`,
  }))

  return (
    <div className="stat-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Sales Trend (30 days)</h3>
          <p className="text-xs text-gray-500">Total: Rs. {totalRevenue.toLocaleString()} | Avg: Rs. {Math.round(avgDaily).toLocaleString()}/day</p>
        </div>
      </div>

      <div className="overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line x1={padding} y1={tick.y} x2={width - padding} y2={tick.y} stroke="#f3f4f6" strokeWidth="1" />
              <text x={padding - 4} y={tick.y + 4} textAnchor="end" fontSize="8" fill="#9ca3af">{tick.label}</text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#gradient)" opacity="0.3" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* X-axis labels (every 5 days) */}
          {points.filter((_, i) => i % 5 === 0 || i === points.length - 1).map((p, i) => (
            <text key={i} x={p.x} y={height - 8} textAnchor="middle" fontSize="7" fill="#9ca3af">{p.label}</text>
          ))}

          {/* Gradient def */}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Tooltip dots on hover (simplified) */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2" fill="#3b82f6" opacity="0" className="hover:opacity-100 transition-opacity" />
          ))}
        </svg>
      </div>
    </div>
  )
}
