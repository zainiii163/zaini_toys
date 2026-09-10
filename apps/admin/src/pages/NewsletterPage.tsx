import { useState } from 'react'
import { Send, Eye, EyeOff, Edit3, CheckCircle } from 'lucide-react'
import { useGetNewslettersQuery, useUpdateNewsletterStatusMutation } from '../app/services/newsletter'
import toast from 'react-hot-toast'

export default function NewsletterPage() {
  const { data, isLoading } = useGetNewslettersQuery({ limit: '50' })
  const [updateStatus] = useUpdateNewsletterStatusMutation()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const subscribers = data?.data?.filter((n: any) => n.isSubscribed) || []
  const unsubscribed = data?.data?.filter((n: any) => !n.isSubscribed) || []

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await updateStatus({ id, body: { isSubscribed: active } }).unwrap()
      toast.success(`Subscriber ${active ? 'activated' : 'deactivated'}`)
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleSendEmail = async (id: string) => {
    if (!subject || !body) {
      toast.error('Subject and body are required')
      return
    }
    try {
      await updateStatus({ id, body: { isSubscribed: true } }).unwrap()
      toast.success('Email sent!')
      setSubject('')
      setBody('')
    } catch {
      toast.error('Failed to send email')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {subscribers.length} active
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {unsubscribed.length} unsubscribed
          </span>
        </div>
      </div>

      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="stat-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Subscribed</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((n: any) => (
                <tr key={n._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{n.email}</td>
                  <td className="px-4 py-3">{n.name || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{n.source}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" /> Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingId(n._id)}
                        className="rounded p-1 hover:bg-gray-100"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleToggle(n._id, false)}
                        className="rounded p-1 hover:bg-red-50"
                        title="Deactivate"
                      >
                        <EyeOff className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {unsubscribed.slice(0, 5).map((n: any) => (
                <tr key={n._id} className="hover:bg-gray-50 opacity-60">
                  <td className="px-4 py-3">{n.email}</td>
                  <td className="px-4 py-3">{n.name || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{n.source}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Eye className="h-3 w-3" /> Unsubscribed
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(n._id, true)}
                      className="rounded p-1 hover:bg-green-50"
                      title="Activate"
                    >
                      <Eye className="h-4 w-4 text-green-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Email Compose */}
      {editingId && (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-4 font-semibold">Compose Email</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-toy w-full"
                placeholder="Email subject..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Body (HTML)</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="input-toy w-full"
                placeholder="<h1>Welcome!</h1>..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSendEmail(editingId)}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Send className="h-4 w-4" /> Send Email
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
