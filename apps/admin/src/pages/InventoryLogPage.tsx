import { useState, useEffect } from 'react'
import { Search, Package, ArrowDown, ArrowUp, RotateCcw, AlertTriangle, Truck } from 'lucide-react'
import { api } from '../app/api'

interface InventoryLog {
  _id: string
  product: { name: string; sku: string }
  type: 'in' | 'out' | 'adjustment' | 'return' | 'damaged' | 'transfer'
  quantity: number
  previousStock: number
  newStock: number
  reason: string
  reference?: string
  performedBy: { name: string }
  createdAt: string
}

const TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  in: { icon: ArrowDown, color: 'text-green-600 bg-green-50', label: 'Stock In' },
  out: { icon: ArrowUp, color: 'text-red-600 bg-red-50', label: 'Stock Out' },
  adjustment: { icon: RotateCcw, color: 'text-blue-600 bg-blue-50', label: 'Adjustment' },
  return: { icon: Package, color: 'text-amber-600 bg-amber-50', label: 'Return' },
  damaged: { icon: AlertTriangle, color: 'text-red-600 bg-red-50', label: 'Damaged' },
  transfer: { icon: Truck, color: 'text-purple-600 bg-purple-50', label: 'Transfer' },
}

export default function InventoryLogPage() {
  const [logs, setLogs] = useState<InventoryLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { limit: '50' }
      if (search) params.search = search
      if (typeFilter) params.type = typeFilter
      const res = await api.get('/inventory/logs', { params })
      setLogs(res.data.data || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchLogs() }, [search, typeFilter])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Inventory Log</h1>

      <div className="stat-card mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Search by product..."
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All Types</option>
          <option value="in">Stock In</option>
          <option value="out">Stock Out</option>
          <option value="adjustment">Adjustment</option>
          <option value="return">Return</option>
          <option value="damaged">Damaged</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      <div className="stat-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Product</th>
              <th className="p-3 font-medium">Qty</th>
              <th className="p-3 font-medium">Stock Change</th>
              <th className="p-3 font-medium">Reason</th>
              <th className="p-3 font-medium">By</th>
              <th className="p-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">No inventory logs found</td></tr>
            ) : logs.map((log) => {
              const config = TYPE_CONFIG[log.type] || TYPE_CONFIG.adjustment
              const Icon = config.icon
              return (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>
                      <Icon className="h-3 w-3" /> {config.label}
                    </span>
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{log.product?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{log.product?.sku}</p>
                  </td>
                  <td className={`p-3 font-semibold ${log.type === 'in' || log.type === 'return' ? 'text-green-600' : 'text-red-600'}`}>
                    {log.type === 'in' || log.type === 'return' ? '+' : '-'}{log.quantity}
                  </td>
                  <td className="p-3 text-gray-600">
                    {log.previousStock} → {log.newStock}
                  </td>
                  <td className="p-3 text-gray-600 max-w-[200px] truncate">{log.reason || '—'}</td>
                  <td className="p-3 text-gray-500">{log.performedBy?.name || '—'}</td>
                  <td className="p-3 text-gray-500 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
