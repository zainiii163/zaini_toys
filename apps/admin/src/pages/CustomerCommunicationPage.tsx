import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { useGetOrdersQuery } from '../app/services/order'
import toast from 'react-hot-toast'

export default function CustomerCommunicationPage() {
  const { data: ordersData } = useGetOrdersQuery({ limit: '50', sort: '-createdAt' })
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Record<string, { from: string; text: string; time: string }[]>>({})

  const orders = ordersData?.data || []
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed')

  const onSend = () => {
    if (!message.trim() || !selectedOrder) return
    const order = orders.find((o) => o._id === selectedOrder)
    const newMsg = {
      from: 'admin',
      text: message,
      time: new Date().toLocaleString(),
    }
    setMessages((prev) => ({
      ...prev,
      [selectedOrder!]: [...(prev[selectedOrder!] || []), newMsg],
    }))
    setMessage('')
    toast.success('Message sent to customer')
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Communication</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            {pendingOrders.length} pending
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order List */}
        <div className="lg:col-span-2">
          <div className="stat-card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Messages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o: any) => (
                  <tr
                    key={o._id}
                    onClick={() => setSelectedOrder(o._id)}
                    className={`cursor-pointer hover:bg-gray-50 ${selectedOrder === o._id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-4 py-3 font-medium">#{o.orderNumber}</td>
                    <td className="px-4 py-3">{o.customerInfo?.name || 'Customer'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {o.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">
                        {(messages[o._id]?.length || 0)} msg
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chat */}
        <div>
          <div className="stat-card">
            <h3 className="mb-4 font-semibold">
              {selectedOrder ? `Order #${orders.find((o) => o._id === selectedOrder)?.orderNumber}` : 'Select an order'}
            </h3>

            {selectedOrder ? (
              <>
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{orders.find((o) => o._id === selectedOrder)?.customerInfo?.name}</p>
                    <p className="text-xs text-gray-500">{orders.find((o) => o._id === selectedOrder)?.customerInfo?.email}</p>
                  </div>
                </div>

                <div className="mb-4 space-y-2 max-h-64 overflow-y-auto">
                  {(messages[selectedOrder] || []).map((msg, i) => (
                    <div key={i} className={`rounded-lg p-3 text-sm ${
                      msg.from === 'admin' ? 'bg-blue-50 ml-8' : 'bg-gray-100 mr-8'
                    }`}>
                      <p className="text-xs text-gray-500">{msg.time}</p>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input-toy flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && onSend()}
                  />
                  <button onClick={onSend} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-sm text-gray-500">
                <Mail className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2">Select an order to start a conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
