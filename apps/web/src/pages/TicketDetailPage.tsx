import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useGetTicketQuery, useAddTicketMessageMutation } from '../app/services/support'
import { useAppSelector } from '../hooks/typed'
import toast from 'react-hot-toast'

const STATUS_ICONS: Record<string, any> = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle,
  closed: CheckCircle,
}

const STATUS_COLORS: Record<string, string> = {
  open: 'text-orange-500',
  in_progress: 'text-blue-500',
  resolved: 'text-green-500',
  closed: 'text-gray-500',
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const auth = useAppSelector((s) => s.auth)
  const [reply, setReply] = useState('')

  const { data: ticketData, isLoading } = useGetTicketQuery(id || '', { skip: !id })
  const [addMessage, { isLoading: sending }] = useAddTicketMessageMutation()

  const ticket = ticketData?.data

  const onSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim() || !id) return
    try {
      await addMessage({ id, message: reply }).unwrap()
      setReply('')
      toast.success('Reply sent')
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to send reply')
    }
  }

  if (isLoading) {
    return (
      <div className="container-toy py-8">
        <div className="mx-auto max-w-3xl space-y-4 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="container-toy py-12 text-center">
        <p className="text-gray-500">Ticket not found.</p>
        <Link to="/support" className="btn-primary mt-4 inline-block text-sm">Back to Support</Link>
      </div>
    )
  }

  const StatusIcon = STATUS_ICONS[ticket.status] || AlertCircle

  return (
    <div className="container-toy py-8">
      <Link to="/support" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" /> Back to Support
      </Link>

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="card-toy mb-6 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-gray-500">{ticket.ticketNumber}</span>
                <span className={`flex items-center gap-1 text-sm font-medium ${STATUS_COLORS[ticket.status]}`}>
                  <StatusIcon className="h-4 w-4" /> {ticket.status.replace('_', ' ')}
                </span>
              </div>
              <h1 className="mt-2 font-display text-xl font-bold">{ticket.subject}</h1>
            </div>
          </div>
          <div className="mt-3 flex gap-2 text-xs text-gray-500">
            <span className="rounded-full bg-gray-100 px-2 py-0.5">{ticket.category}</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5">Priority: {ticket.priority}</span>
            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-6">
          {/* Initial message */}
          <div className="card-toy p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{auth.user?.name || 'You'}</span>
              <span className="text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{ticket.message}</p>
          </div>

          {/* Thread messages */}
          {ticket.messages?.map((msg, i) => {
            const isUser = typeof msg.sender === 'object' ? (msg.sender as any)._id === auth.user?._id : msg.sender === auth.user?._id
            const senderName = isUser ? (auth.user?.name || 'You') : (typeof msg.sender === 'object' ? msg.sender.name : 'Support')
            return (
              <div key={i} className={`card-toy p-4 ${!isUser ? 'border-l-4 border-blue-500' : ''}`}>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{senderName}</span>
                  {!isUser && <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-600">Support</span>}
                  <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{msg.message}</p>
              </div>
            )
          })}
        </div>

        {/* Reply Form */}
        {ticket.status !== 'closed' ? (
          <form onSubmit={onSendReply} className="card-toy p-4">
            <label className="mb-2 block text-sm font-medium">Reply</label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Type your reply..."
            />
            <div className="mt-3 flex justify-end">
              <button type="submit" disabled={sending || !reply.trim()} className="btn-primary flex items-center gap-2 text-sm">
                <Send className="h-4 w-4" /> {sending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </form>
        ) : (
          <div className="card-toy p-4 text-center text-sm text-gray-500">This ticket is closed.</div>
        )}
      </div>
    </div>
  )
}
