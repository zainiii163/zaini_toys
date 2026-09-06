import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye } from 'lucide-react'
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../app/services/order'
import { formatDate } from '../lib/utils'

const STATUSES = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']

export default function OrdersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [updateStatus] = useUpdateOrderStatusMutation()
  const { data, isLoading } = useGetOrdersQuery({ page: String(page), limit: '20', search, status })

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateStatus({ id: orderId, status: newStatus })
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>

      <div className="stat-card mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Search orders..." />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="stat-card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data?.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">#{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.customerInfo?.name}</td>
                  <td className="px-4 py-3 font-medium">Rs. {order.total?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="rounded border border-gray-300 px-2 py-1 text-xs">
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/orders/${order.orderNumber}`} className="rounded p-1 hover:bg-gray-100"><Eye className="h-4 w-4 text-gray-600" /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-500">Page {data.pagination.page} of {data.pagination.pages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50">Prev</button>
                <button onClick={() => setPage(Math.min(data.pagination.pages, page + 1))} disabled={page >= data.pagination.pages} className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
