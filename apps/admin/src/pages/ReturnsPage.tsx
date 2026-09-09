import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw, Package, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../app/services/order'

const STATUS_COLORS: Record<string, string> = {
  return_requested: 'bg-yellow-100 text-yellow-700',
  return_approved: 'bg-blue-100 text-blue-700',
  returned: 'bg-purple-100 text-purple-700',
  refunded: 'bg-green-100 text-green-700',
}

export default function ReturnsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const { data: ordersData, isLoading } = useGetOrdersQuery({ limit: '100', sort: '-createdAt' })
  const [updateStatus] = useUpdateOrderStatusMutation()

  const orders = ordersData?.data || []
  const returnOrders = orders.filter((o: any) =>
    o.status === 'return_requested' || o.status === 'return_approved' || o.status === 'returned' || o.status === 'refunded'
  )

  const filtered = statusFilter === 'all' ? returnOrders : returnOrders.filter((o) => o.status === statusFilter)

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap()
      toast.success(`Order status updated to ${newStatus}`)
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to update status')
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Returns & Refunds</h1>
        <div className="flex items-center gap-2">
          {['all', 'return_requested', 'return_approved', 'returned', 'refunded'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="stat-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">No return requests found.</td>
                </tr>
              ) : (
                filtered.map((o: any) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium">#{o.orderNumber}</p>
                      <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{o.customerInfo?.name || 'Customer'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{o.items?.length || 0} item(s)</span>
                    </td>
                    <td className="px-4 py-3 font-medium">Rs. {o.total?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-500'}`}>
                        {o.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="flex items-center gap-2 px-4 py-3">
                      {o.status === 'return_requested' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(o._id, 'return_approved')}
                            className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                          >
                            <CheckCircle className="mr-1 inline h-3 w-3" /> Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(o._id, 'cancelled')}
                            className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                          >
                            <XCircle className="mr-1 inline h-3 w-3" /> Reject
                          </button>
                        </>
                      )}
                      {o.status === 'return_approved' && (
                        <button
                          onClick={() => handleStatusUpdate(o._id, 'returned')}
                          className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          <Package className="mr-1 inline h-3 w-3" /> Mark Received
                        </button>
                      )}
                      {o.status === 'returned' && (
                        <button
                          onClick={() => handleStatusUpdate(o._id, 'refunded')}
                          className="rounded-lg bg-purple-600 px-3 py-1 text-xs font-medium text-white hover:bg-purple-700"
                        >
                          <RotateCcw className="mr-1 inline h-3 w-3" /> Process Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}