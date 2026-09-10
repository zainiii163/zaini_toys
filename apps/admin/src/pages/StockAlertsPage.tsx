import { useState } from 'react'
import { Package, AlertTriangle, Send, Clock } from 'lucide-react'
import { useGetProductsQuery, useUpdateProductMutation } from '../app/services/product'
import toast from 'react-hot-toast'

export default function StockAlertsPage() {
  const { data: productsData } = useGetProductsQuery({ limit: '200' })
  const [updateProduct] = useUpdateProductMutation()
  const [notifications, setNotifications] = useState<string[]>([])

  const products = productsData?.data || []

  const lowStockProducts = products.filter((p: any) => (p.availableStock || 0) > 0 && (p.availableStock || 0) <= 5)
  const outOfStockProducts = products.filter((p: any) => (p.availableStock || 0) === 0)

  const onNotify = (text: string) => {
    setNotifications((prev) => [...prev, `${new Date().toLocaleString()}: ${text}`])
    toast.success('Notification added')
  }

  const onRestock = async (productId: string) => {
    try {
      const fd = new FormData()
      fd.append('availableStock', '50')
      await updateProduct({ id: productId, body: fd }).unwrap()
      toast.success('Stock updated to 50')
    } catch {
      toast.error('Failed to restock')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stock Alerts</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            {outOfStockProducts.length} Out of Stock
          </span>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            {lowStockProducts.length} Low Stock
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock */}
        <div className="stat-card">
          <h3 className="mb-4 font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" /> Low Stock Products
          </h3>
          <div className="space-y-3">
            {lowStockProducts.slice(0, 10).map((p: any) => (
              <div key={p._id} className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-yellow-700">SKU: {p.sku} • {p.availableStock} left</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRestock(p._id)}
                    className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                  >
                    <Package className="h-3 w-3" /> Restock
                  </button>
                  <button
                    onClick={() => onNotify(`Low stock alert for ${p.name} (${p.sku})`)}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    <Send className="h-3 w-3" /> Notify
                  </button>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-500">All products well stocked</p>
            )}
          </div>
        </div>

        {/* Out of Stock */}
        <div className="stat-card">
          <h3 className="mb-4 font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-red-600" /> Out of Stock Products
          </h3>
          <div className="space-y-3">
            {outOfStockProducts.slice(0, 10).map((p: any) => (
              <div key={p._id} className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3">
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-red-700">SKU: {p.sku}</p>
                </div>
                <button
                  onClick={() => onRestock(p._id)}
                  className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                >
                  <Package className="h-3 w-3" /> Restock
                </button>
              </div>
            ))}
            {outOfStockProducts.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-500">No out of stock products</p>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="stat-card lg:col-span-2">
          <h3 className="mb-4 font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" /> Notification History ({notifications.length})
          </h3>
          {notifications.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">No notifications yet.</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((n, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-sm">
                  <span className="text-xs text-gray-500">{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
