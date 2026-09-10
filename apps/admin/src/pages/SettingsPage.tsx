import { useState } from 'react'
import { useGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation } from '../app/services/auth'
import toast from 'react-hot-toast'
import { Store, Truck, CreditCard, Save } from 'lucide-react'

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

  // Store settings (local state, can be connected to settings API)
  const [storeName, setStoreName] = useState('Toy Shop Pakistan')
  const [storeEmail, setStoreEmail] = useState('support@toystore.pk')
  const [storePhone, setStorePhone] = useState('+92 300 1234567')
  const [currency, setCurrency] = useState('PKR')
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('3000')
  const [flatShippingFee, setFlatShippingFee] = useState('200')
  const [expressShippingFee, setExpressShippingFee] = useState('500')
  const [taxRate, setTaxRate] = useState('0')
  const [lowStockThreshold, setLowStockThreshold] = useState('5')
  const [storeSaved, setStoreSaved] = useState(false)

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
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    if (newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap()
      toast.success('Password changed')
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
      setPasswordSaved(true); setTimeout(() => setPasswordSaved(false), 3000)
    } catch (err: any) { toast.error(err?.data?.error || 'Failed to change password') }
  }

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Store settings saved')
    setStoreSaved(true); setTimeout(() => setStoreSaved(false), 3000)
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Settings</h1>
        <div className="max-w-3xl space-y-6">
          {[1, 2, 3].map((i) => <div key={i} className="stat-card animate-pulse"><div className="h-40 bg-gray-200 rounded" /></div>)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      <div className="max-w-3xl space-y-6">
        {/* Account Info */}
        <div className="stat-card">
          <h2 className="mb-4 font-semibold">Account Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{user?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{user?.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="font-medium capitalize">{user?.role}</span></div>
          </div>
        </div>

        {/* Edit Profile */}
        <form onSubmit={handleProfileSubmit} className="stat-card">
          <h2 className="mb-4 font-semibold">Edit Profile</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input type="text" defaultValue={user?.name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input type="email" defaultValue={user?.email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input type="tel" defaultValue={user?.phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save Changes</button>
              {profileSaved && <span className="text-sm text-green-600">Saved!</span>}
            </div>
          </div>
        </form>

        {/* Store Settings */}
        <form onSubmit={handleStoreSubmit} className="stat-card">
          <div className="mb-4 flex items-center gap-2">
            <Store className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold">Store Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Store Name</label>
                <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value="PKR">PKR (₨)</option>
                  <option value="USD">USD ($)</option>
                  <option value="AED">AED</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Store Email</label>
                <input type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Store Phone</label>
                <input type="tel" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-sm">Shipping Configuration</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Free Shipping Threshold (₨)</label>
                <input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Flat Rate (₨)</label>
                <input type="number" value={flatShippingFee} onChange={(e) => setFlatShippingFee(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Express Fee (₨)</label>
                <input type="number" value={expressShippingFee} onChange={(e) => setExpressShippingFee(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium text-sm">Inventory & Tax</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Low Stock Alert Threshold</label>
                <input type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tax Rate (%)</label>
                <input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button type="submit" className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Save className="h-4 w-4" /> Save Store Settings
            </button>
            {storeSaved && <span className="text-sm text-green-600">Saved!</span>}
          </div>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordSubmit} className="stat-card">
          <h2 className="mb-4 font-semibold">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required minLength={8} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required minLength={8} />
              </div>
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
