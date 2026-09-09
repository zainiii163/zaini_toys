import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { formatDate } from '../lib/utils'

type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN'

interface LogEntry {
  _id: string
  date: string
  user: string
  action: ActionType
  resource: string
  details: string
}

const ACTION_STYLES: Record<ActionType, string> = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
  LOGIN: 'bg-gray-100 text-gray-700',
}

const DUMMY_LOGS: LogEntry[] = [
  { _id: '1', date: '2026-09-08T10:30:00Z', user: 'Ali Khan', action: 'LOGIN', resource: 'Auth', details: 'Logged in successfully' },
  { _id: '2', date: '2026-09-08T11:15:00Z', user: 'Ali Khan', action: 'CREATE', resource: 'Product', details: 'Created product "Wireless Headphones"' },
  { _id: '3', date: '2026-09-08T12:00:00Z', user: 'Sara Ahmed', action: 'UPDATE', resource: 'Order', details: 'Updated order #ORD-001 status to shipped' },
  { _id: '4', date: '2026-09-08T13:45:00Z', user: 'Ali Khan', action: 'DELETE', resource: 'Coupon', details: 'Deleted coupon "SUMMER20"' },
  { _id: '5', date: '2026-09-07T09:00:00Z', user: 'Sara Ahmed', action: 'LOGIN', resource: 'Auth', details: 'Logged in successfully' },
  { _id: '6', date: '2026-09-07T10:20:00Z', user: 'Ali Khan', action: 'CREATE', resource: 'Category', details: 'Created category "Electronics"' },
  { _id: '7', date: '2026-09-07T11:30:00Z', user: 'Sara Ahmed', action: 'UPDATE', resource: 'Product', details: 'Updated product price for "Smart Watch"' },
  { _id: '8', date: '2026-09-06T14:00:00Z', user: 'Ali Khan', action: 'UPDATE', resource: 'Banner', details: 'Updated homepage banner' },
  { _id: '9', date: '2026-09-06T15:30:00Z', user: 'Sara Ahmed', action: 'CREATE', resource: 'Coupon', details: 'Created coupon "WELCOME10"' },
  { _id: '10', date: '2026-09-06T16:45:00Z', user: 'Ali Khan', action: 'DELETE', resource: 'Product', details: 'Deleted product "Old Keyboard"' },
]

export default function AuditLogPage() {
  const [actionFilter, setActionFilter] = useState<ActionType | ''>('')
  const [userFilter, setUserFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search, setSearch] = useState('')

  const filteredLogs = DUMMY_LOGS.filter((log) => {
    if (actionFilter && log.action !== actionFilter) return false
    if (userFilter && !log.user.toLowerCase().includes(userFilter.toLowerCase())) return false
    if (dateFrom && new Date(log.date) < new Date(dateFrom)) return false
    if (dateTo && new Date(log.date) > new Date(dateTo + 'T23:59:59Z')) return false
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        log.user.toLowerCase().includes(searchLower) ||
        log.resource.toLowerCase().includes(searchLower) ||
        log.details.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const inputClass = "rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Audit Log</h1>
      <p className="mb-6 text-sm text-gray-500">Track all system activities and user actions</p>

      <div className="stat-card mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Search logs..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value as ActionType | '')} className={inputClass}>
              <option value="">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="LOGIN">LOGIN</option>
            </select>
          </div>
          <input
            type="text"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className={inputClass}
            placeholder="Filter by user..."
          />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={inputClass}
            placeholder="From"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={inputClass}
            placeholder="To"
          />
        </div>
      </div>

      <div className="stat-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Resource</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLogs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">{formatDate(log.date)}</td>
                <td className="px-4 py-3 font-medium">{log.user}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_STYLES[log.action]}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{log.resource}</td>
                <td className="px-4 py-3 text-gray-600">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">No log entries found</p>
        )}
      </div>
    </div>
  )
}
