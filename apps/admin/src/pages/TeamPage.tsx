import { useState } from 'react'
import { Shield, Users, Edit, Trash2, Plus, X } from 'lucide-react'
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from '../app/services/user'
import { formatDate } from '../lib/utils'

type Role = 'super-admin' | 'admin' | 'staff' | 'viewer'

interface TeamMember {
  _id: string
  name: string
  email: string
  role: Role
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

const ROLE_STYLES: Record<Role, string> = {
  'super-admin': 'bg-red-100 text-red-700',
  admin: 'bg-blue-100 text-blue-700',
  staff: 'bg-green-100 text-green-700',
  viewer: 'bg-gray-100 text-gray-700',
}

export default function TeamPage() {
  const { data, isLoading } = useGetUsersQuery({ limit: '100', role: 'admin,staff,super-admin,viewer' })
  const [updateUser] = useUpdateUserMutation()
  const [deleteUser] = useDeleteUserMutation()
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<TeamMember | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' as Role })

  const users = (data?.data || []) as TeamMember[]

  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

  const openAddModal = () => {
    setEditingUser(null)
    setForm({ name: '', email: '', password: '', role: 'staff' })
    setShowModal(true)
  }

  const openEditModal = (user: TeamMember) => {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, password: '', role: user.role })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      await updateUser({ id: editingUser._id, body: { role: form.role } as any })
    }
    setShowModal(false)
    setEditingUser(null)
    setForm({ name: '', email: '', password: '', role: 'staff' })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this team member?')) {
      await deleteUser(id)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateUser({ id, body: { isActive: !isActive } as any })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-sm text-gray-500">Manage admin and staff users</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Super Admins</p>
            <p className="text-2xl font-bold">{users.filter((u) => u.role === 'super-admin').length}</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Admins</p>
            <p className="text-2xl font-bold">{users.filter((u) => u.role === 'admin').length}</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Staff</p>
            <p className="text-2xl font-bold">{users.filter((u) => u.role === 'staff').length}</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Viewers</p>
            <p className="text-2xl font-bold">{users.filter((u) => u.role === 'viewer').length}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="stat-card h-16 animate-pulse bg-gray-100" />)}
        </div>
      ) : (
        <div className="stat-card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last Login</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_STYLES[user.role] || ROLE_STYLES.viewer}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="flex items-center gap-2 px-4 py-3">
                    <button onClick={() => handleToggleActive(user._id, user.isActive)} className={`rounded px-2 py-1 text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => openEditModal(user)} className="rounded p-1 hover:bg-gray-100">
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="rounded p-1 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editingUser ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button onClick={() => { setShowModal(false); setEditingUser(null) }} className="rounded p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  required
                  disabled={!!editingUser}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  required
                  disabled={!!editingUser}
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={inputClass}
                    required
                    minLength={8}
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                  className={inputClass}
                >
                  <option value="super-admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  {editingUser ? 'Update Role' : 'Add Member'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setEditingUser(null) }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
