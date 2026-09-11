import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react'
import { apiFetch } from '../lib/api'

interface DailySales {
  date: string
  revenue: number
  orders: number
}

interface CouponStats {
  total: number
  active: number
  totalUsage: number
  topCoupons: { code: string; usageCount: number; type: string; value: number }[]
}

export default function CouponAnalyticsPage() {
  const [couponStats, setCouponStats] = useState<CouponStats | null>(null)
  const [dailySales, setDailySales] = useState<DailySales[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7d')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
const [statsRes, salesRes] = await Promise.all([
        apiFetch('/coupons/admin/stats').then((r) => r.json()).catch(() => ({ data: null })),
        apiFetch(`/orders/admin/stats/daily?period=${period}`).then((r) => r.json()).catch(() => ({ data: [] })),
      ])
      setCouponStats(statsRes.data)
      setDailySales(salesRes.data || [])
      } catch {}
      setLoading(false)
    }
    fetchData()
  }, [period])

  const maxRevenue = Math.max(...dailySales.map((d) => d.revenue), 1)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => <div key={i} className="stat-card h-64 animate-pulse"><div className="h-full bg-gray-100 rounded" /></div>)}
        </div>
      ) : (
        <>
          {/* Sales Chart */}
          <div className="stat-card mb-6">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold">Daily Revenue</h2>
            </div>
            {dailySales.length === 0 ? (
              <p className="py-12 text-center text-gray-400">No sales data available</p>
            ) : (
              <div className="flex items-end gap-2 h-48">
                {dailySales.map((day, i) => {
                  const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-500">Rs. {(day.revenue / 1000).toFixed(0)}k</span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 transition-all hover:from-blue-700 hover:to-blue-500"
                        style={{ height: `${Math.max(height, 4)}%` }}
                        title={`${day.date}: Rs. ${day.revenue.toLocaleString()} (${day.orders} orders)`}
                      />
                      <span className="text-[10px] text-gray-400">{new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Coupon Stats */}
          {couponStats && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="stat-card">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h2 className="font-semibold">Coupon Overview</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-blue-50 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{couponStats.total}</p>
                    <p className="text-xs text-gray-500">Total Coupons</p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{couponStats.active}</p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-4 text-center">
                    <p className="text-2xl font-bold text-amber-600">{couponStats.totalUsage}</p>
                    <p className="text-xs text-gray-500">Total Uses</p>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <h2 className="font-semibold">Top Coupons</h2>
                </div>
                {couponStats.topCoupons?.length === 0 ? (
                  <p className="py-6 text-center text-sm text-gray-400">No coupon usage yet</p>
                ) : (
                  <div className="space-y-2">
                    {couponStats.topCoupons?.map((c) => (
                      <div key={c.code} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                        <div>
                          <span className="font-mono font-bold text-sm">{c.code}</span>
                          <span className="ml-2 text-xs text-gray-500">{c.type === 'percentage' ? `${c.value}% off` : `Rs. ${c.value} off`}</span>
                        </div>
                        <span className="text-sm font-semibold">{c.usageCount} uses</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
