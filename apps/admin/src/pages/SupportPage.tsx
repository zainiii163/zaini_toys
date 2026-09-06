import { useState } from 'react'
import { Clock, CheckCircle, AlertTriangle, Send } from 'lucide-react'
import { useGetTicketsQuery, useUpdateTicketStatusMutation, useReplyToTicketMutation } from '../app/services/support'
import { formatDate } from '../lib/utils'

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
}

const STATUS_ICONS: Record<string, any> = {
  open: Clock,
  in_progress: AlertTriangle,
  resolved: CheckCircle,
  closed: CheckCircle,
}

export default function SupportPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const params: Record<string, string> = { page: String(page), limit: '10' }
  if (statusFilter) params.status = statusFilter
  if (priorityFilter) params.priority = priorityFilter

  const { data, isLoading } = useGetTicketsQuery(params)
  const [updateStatus] = useUpdateTicketStatusMutation()
  const [replyToTicket] = useReplyToTicketMutation()

  const tickets = data?.data || []
  const pagination = data?.pagination

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return
    await replyToTicket({ id, message: replyText })
    setReplyText('')
  }

  const handleStatusChange = async (id: string, status: string) => {
    await updateStatus({ id, status })
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Support Tickets</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex gap-1">
          {['', 'open', 'in_progress', 'resolved', 'closed'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {['', 'low', 'medium', 'high', 'urgent'].map((p) => (
            <button
              key={p}
              onClick={() => { setPriorityFilter(p); setPage(1) }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${priorityFilter === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {p || 'Priority'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="stat-card animate-pulse"><div className="h-20 bg-gray-200 rounded" /></div>)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="stat-card text-center py-12 text-gray-500">No tickets found</div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const StatusIcon = STATUS_ICONS[ticket.status] || Clock
            return (
              <div key={ticket._id} className="stat-card">
                <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === ticket._id ? null : ticket._id)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-gray-500">#{ticket.ticketNumber}</span>
                      <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[ticket.priority]}`}>{ticket.priority}</span>
                      <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${STATUS_COLORS[ticket.status]}`}>{ticket.status.replace('_', ' ')}</span>
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{ticket.category}</span>
                    </div>
                    <p className="mt-1 font-medium">{ticket.subject}</p>
                    <p className="text-sm text-gray-500">{ticket.user?.name} ({ticket.user?.email}) | {formatDate(ticket.createdAt)}</p>
                  </div>
                  <StatusIcon className="h-5 w-5 text-gray-400" />
                </div>

                {expandedId === ticket._id && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-700 mb-3">{ticket.message}</p>

                    {ticket.messages?.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {ticket.messages.map((msg, i) => (
                          <div key={i} className="rounded-lg bg-gray-50 p-3 text-sm">
                            <p className="font-medium">{msg.sender?.name || 'User'}</p>
                            <p className="text-gray-600">{msg.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(msg.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type a reply..."
                        className="input-toy flex-1"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button onClick={(e) => { e.stopPropagation(); handleReply(ticket._id) }} className="btn-primary !py-1.5 text-sm">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex gap-2">
                      {['open', 'in_progress', 'resolved', 'closed'].map((s) => (
                        <button
                          key={s}
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(ticket._id, s) }}
                          className={`rounded-lg px-2 py-1 text-xs font-medium ${ticket.status === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pagination.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
