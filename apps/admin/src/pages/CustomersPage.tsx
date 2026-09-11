import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Trash2, Eye } from 'lucide-react'
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation, useToggleBlockUserMutation } from '../app/services/user'
import { formatDate } from '../lib/utils'

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteUser] = useDeleteUserMutation()
  const [updateUser] = useUpdateUserMutation()
  const [toggleBlock] = useToggleBlockUserMutation()
  const { data, isLoading } = useGetUsersQuery({ page: String(page), limit: '20', search })

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateUser({ id, body: { isActive: !isActive } as any })
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Customers</h1>
      <div className="stat-card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Search customers..." />
        </div>
      </div>

      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="stat-card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Loyalty</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data?.map((u: any) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/customers/${u._id}`} className="font-medium hover:text-blue-600 hover:underline">{u.name}</Link>
                    <p className="text-xs text-gray-500">{u.email || u.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'customer' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{u.loyaltyTier} ({u.loyaltyPoints} pts)</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                  <td className="flex items-center gap-2 px-4 py-3">
                    <Link to={`/customers/${u._id}`} className="rounded p-1 hover:bg-blue-50" title="View details">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Link>
                    <button onClick={() => handleToggleActive(u._id, u.isActive)} className={`rounded px-2 py-1 text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => toggleBlock(u._id)} className={`rounded px-2 py-1 text-xs font-medium ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {u.isBlocked ? 'Blocked' : 'Block'}
                    </button>
                    <button onClick={() => { if (confirm('Delete user?')) deleteUser(u._id) }} className="rounded p-1 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></button>
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
