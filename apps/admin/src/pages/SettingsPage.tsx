import { useState } from 'react'
import { useGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation } from '../app/services/auth'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { data, isLoading } = useGetMeQuery()
  const user = data?.data?.user
  const [updateProfile] = useUpdateProfileMutation()
  const [changePassword] = useChangePasswordMutation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({ name, email, phone }).unwrap()
      toast.success('Profile updated')
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to update profile')
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap()
      toast.success('Password changed')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSaved(true)
      setTimeout(() => setPasswordSaved(false), 3000)
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to change password')
    }
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Settings</h1>
        <div className="max-w-2xl space-y-6">
          {[1, 2].map((i) => <div key={i} className="stat-card animate-pulse"><div className="h-40 bg-gray-200 rounded" /></div>)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      <div className="max-w-2xl space-y-6">
        <div className="stat-card">
          <h2 className="mb-4 font-semibold">Account Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{user?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{user?.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="font-medium capitalize">{user?.role}</span></div>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="stat-card">
          <h2 className="mb-4 font-semibold">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input
                type="tel"
                defaultValue={user?.phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save Changes</button>
              {profileSaved && <span className="text-sm text-green-600">Saved!</span>}
            </div>
          </div>
        </form>

        <form onSubmit={handlePasswordSubmit} className="stat-card">
          <h2 className="mb-4 font-semibold">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
                minLength={8}
              />
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Change Password</button>
              {passwordSaved && <span className="text-sm text-green-600">Changed!</span>}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
