import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'
import { useGetMyTicketsQuery, useCreateTicketMutation } from '../app/services/support'
import { useAppSelector } from '../hooks/typed'
import toast from 'react-hot-toast'

const CATEGORY_LABELS: Record<string, string> = {
  order: 'Order Issue',
  refund: 'Refund Request',
  product: 'Product Question',
  shipping: 'Shipping',
  other: 'Other',
}

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
}

const STATUS_ICONS: Record<string, any> = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle,
  closed: CheckCircle,
}

export default function SupportPage() {
  const auth = useAppSelector((s) => s.auth)
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('other')
  const [priority, setPriority] = useState('medium')

  const { data: ticketsData, isLoading } = useGetMyTicketsQuery({ page: '1', limit: '20' })
  const [createTicket, { isLoading: creating }] = useCreateTicketMutation()

  const tickets = ticketsData?.data || []

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    try {
      await createTicket({ subject, message, category, priority }).unwrap()
      toast.success('Ticket created successfully!')
      setShowForm(false)
      setSubject('')
      setMessage('')
      setCategory('other')
      setPriority('medium')
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to create ticket')
    }
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="container-toy py-12 text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">Please login to view your support tickets.</p>
        <Link to="/login" className="btn-primary mt-4 inline-block">Login</Link>
      </div>
    )
  }

  return (
    <div className="container-toy py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Support Center</h1>
          <p className="mt-1 text-sm text-gray-500">Create tickets and get help from our team.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" /> New Ticket
        </button>
      </div>

      {/* Create Ticket Form */}
      {showForm && (
        <form onSubmit={onSubmit} className="card-toy mb-8 p-6">
          <h2 className="mb-4 font-semibold">Create Support Ticket</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm">
                <option value="order">Order Issue</option>
                <option value="refund">Refund Request</option>
                <option value="product">Product Question</option>
                <option value="shipping">Shipping</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="Brief description of your issue" />
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="Describe your issue in detail..." />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={creating} className="btn-primary text-sm">{creating ? 'Creating...' : 'Submit Ticket'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {/* Tickets List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="py-16 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">No support tickets yet.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 text-sm">Create your first ticket</button>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const StatusIcon = STATUS_ICONS[ticket.status] || AlertCircle
            return (
              <Link
                key={ticket._id}
                to={`/support/${ticket._id}`}
                className="card-toy flex items-center gap-4 p-4 transition-shadow hover:shadow-md"
              >
                <StatusIcon className={`h-5 w-5 flex-shrink-0 ${ticket.status === 'resolved' || ticket.status === 'closed' ? 'text-green-500' : ticket.status === 'in_progress' ? 'text-blue-500' : 'text-orange-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{ticket.ticketNumber}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[ticket.priority]}`}>{ticket.priority}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{CATEGORY_LABELS[ticket.category] || ticket.category}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 truncate">{ticket.subject}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
