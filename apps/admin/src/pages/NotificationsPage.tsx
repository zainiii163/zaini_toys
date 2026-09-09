import { useState, useEffect } from 'react'
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react'
import { api } from '../app/api'
import toast from 'react-hot-toast'

interface Notification {
  _id: string
  title: string
  message: string
  type: string
  isRead: boolean
  link?: string
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data.data || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchNotifications() }, [])

  const markRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n))
    } catch { toast.error('Failed') }
  }

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      toast.success('All marked as read')
    } catch { toast.error('Failed') }
  }

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`)
      setNotifications((prev) => prev.filter((n) => n._id !== id))
    } catch { toast.error('Failed') }
  }

  const unread = notifications.filter((n) => !n.isRead).length

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unread > 0 && <p className="text-sm text-gray-500">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="stat-card">
        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div key={n._id} className={`flex items-start gap-3 p-4 ${!n.isRead ? 'bg-blue-50/50' : ''}`}>
                <div className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${!n.isRead ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Bell className={`h-4 w-4 ${!n.isRead ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.isRead ? 'font-semibold' : 'font-medium'}`}>{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="mt-1 text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!n.isRead && (
                    <button onClick={() => markRead(n._id)} className="rounded p-1.5 hover:bg-gray-100" title="Mark read">
                      <Check className="h-4 w-4 text-green-500" />
                    </button>
                  )}
                  <button onClick={() => deleteNotification(n._id)} className="rounded p-1.5 hover:bg-gray-100" title="Delete">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
