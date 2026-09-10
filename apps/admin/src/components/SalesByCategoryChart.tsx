import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useGetOrdersQuery } from '../app/services/order'
import { useGetProductsQuery } from '../app/services/product'

const COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500',
  'bg-red-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500',
  'bg-orange-500', 'bg-cyan-500',
]

export default function SalesByCategoryChart() {
  const { data: ordersData } = useGetOrdersQuery({ limit: '500', sort: '-createdAt' })
  const { data: productsData } = useGetProductsQuery({ limit: '200' })

  const categorySales = useMemo(() => {
    const orders = ordersData?.data || []
    const products = productsData?.data || []

    // Create a map of product name -> category for matching
    const productCategoryMap = new Map<string, string>()
    for (const p of products) {
      if (p.name && p.category?.name) {
        productCategoryMap.set(p.name.toLowerCase(), p.category.name)
      }
    }

    const sales: Record<string, number> = {}

    for (const order of orders) {
      if (order.status === 'cancelled') continue
      for (const item of order.items || []) {
        const category = productCategoryMap.get(item.productName?.toLowerCase() || '') || 'Uncategorized'
        sales[category] = (sales[category] || 0) + (item.total || item.price * item.quantity || 0)
      }
    }

    return Object.entries(sales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [ordersData, productsData])

  const maxVal = Math.max(...categorySales.map((c) => c.value), 1)
  const total = categorySales.reduce((s, c) => s + c.value, 0)

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Sales by Category</h3>
        <Link to="/analytics" className="text-sm text-blue-600 hover:underline">Full report</Link>
      </div>

      {categorySales.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No sales data yet.</p>
      ) : (
        <div className="space-y-3">
          {categorySales.map((cat, i) => {
            const pct = total > 0 ? (cat.value / total) * 100 : 0
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                  <span className="text-xs text-gray-500">Rs. {cat.value.toLocaleString()} ({pct.toFixed(1)}%)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${COLORS[i % COLORS.length]} transition-all duration-500`}
                    style={{ width: `${(cat.value / maxVal) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
