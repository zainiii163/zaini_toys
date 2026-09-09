import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { User, Package, MapPin, Heart, LogOut, Badge, Trash2, Pencil, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from '../app/services/user'
import { useGetMyOrdersQuery } from '../app/services/order'
import { useGetWishlistsQuery, useDeleteWishlistMutation } from '../app/services/wishlist'
import { useAddToCartMutation } from '../app/services/cart'
import { useAppSelector, useAppDispatch } from '../hooks/typed'
import { logout } from '../store/authSlice'
import { formatDate } from '../lib/utils'
import type { Address } from '../lib/types'

const NAV_ITEMS = [
  { path: 'profile', label: 'Profile', icon: User },
  { path: 'orders', label: 'My Orders', icon: Package },
  { path: 'addresses', label: 'Addresses', icon: MapPin },
  { path: 'wishlist', label: 'Wishlist', icon: Heart },
  { path: 'loyalty', label: 'Loyalty', icon: Badge },
]

const EMPTY_ADDRESS: Address = {
  label: 'Home',
  fullName: '',
  phone: '',
  address: '',
  city: '',
  area: '',
  postalCode: '',
  isDefault: false,
}

export default function AccountPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const auth = useAppSelector((s) => s.auth)
  const { data: profileData } = useGetProfileQuery()

  const user = profileData?.data?.user || auth.user

  const handleLogout = async () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="container-toy py-8">
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="card-toy p-6 sticky top-24">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name || 'Guest'}</p>
                <p className="text-sm text-gray-500">{user?.email || user?.phone}</p>
                <span className="mt-1 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium capitalize text-amber-700">
                  {user?.loyaltyTier || 'bronze'} • {user?.loyaltyPoints || 0} pts
                </span>
              </div>
            </div>
            <nav className="mt-6 space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={`/account/${item.path}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                      isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" /> Sign Out
              </button>
            </nav>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function ProfileTab() {
  const { data: profileData } = useGetProfileQuery()
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (profileData?.data?.user) {
      const u = profileData.data.user
      setForm({ name: u.name, email: u.email, phone: u.phone })
    }
  }, [profileData])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      await updateProfile(form).unwrap()
      setMessage('Profile updated successfully')
    } catch {
      setMessage('Failed to update profile')
    }
  }

  return (
    <div className="card-toy p-6">
      <h2 className="mb-6 font-semibold">Profile Information</h2>
      {message && (
        <div className={`mb-4 rounded-lg p-3 text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}
      <form onSubmit={onSubmit} className="max-w-md space-y-4">
        <div>
          <label className="label-toy">Full Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-toy w-full" />
        </div>
        <div>
          <label className="label-toy">Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-toy w-full" type="email" />
        </div>
        <div>
          <label className="label-toy">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-toy w-full" type="tel" />
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export function OrdersTab() {
  const { data: ordersData } = useGetMyOrdersQuery()
  const [addToCart, { isLoading: adding }] = useAddToCartMutation()
  const orders = ordersData?.data || []

  const onReorder = async (order: any) => {
    try {
      for (const item of order.items) {
        await addToCart({ product: item.product, quantity: item.quantity }).unwrap()
      }
      toast.success('Items added to cart!')
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to add items')
    }
  }

  return (
    <div className="card-toy">
      <div className="border-b border-gray-200 p-6">
        <h2 className="font-semibold">My Orders</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No orders yet.{' '}
            <Link to="/shop" className="text-blue-600">
              Start shopping
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img src={order.items[0]?.productImage} alt="" className="h-16 w-16 rounded-lg object-cover" />
                <div>
                  <p className="font-medium">#{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)} • {order.items.length} item(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {order.status.replace('_', ' ')}
                </span>
                <span className="font-bold text-gray-900">Rs. {order.total.toLocaleString()}</span>
                {(order.status === 'delivered' || order.status === 'cancelled') && (
                  <button
                    onClick={() => onReorder(order)}
                    disabled={adding}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                  >
                    <RefreshCw className="h-3 w-3" /> Reorder
                  </button>
                )}
                <Link to={`/orders/track/${order.orderNumber}`} className="text-sm text-blue-600 hover:underline">
                  Track
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function AddressesTab() {
  const { data: addressesData } = useGetAddressesQuery()
  const [addAddress] = useAddAddressMutation()
  const [updateAddress] = useUpdateAddressMutation()
  const [deleteAddress] = useDeleteAddressMutation()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Address>(EMPTY_ADDRESS)

  const addresses = addressesData?.data?.addresses || []

  const startEdit = (addr: Address) => {
    setForm(addr)
    setEditingId(addr._id || null)
  }

  const resetForm = () => {
    setForm(EMPTY_ADDRESS)
    setEditingId(null)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      await updateAddress({ id: editingId, body: form }).unwrap()
    } else {
      await addAddress(form).unwrap()
    }
    resetForm()
  }

  return (
    <div className="card-toy p-6">
      <h2 className="mb-6 font-semibold">{editingId ? 'Edit Address' : 'Add New Address'}</h2>

      <form onSubmit={onSubmit} className="max-w-md space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="input-toy" placeholder="Label (Home/Work)" />
          <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-toy" placeholder="Full Name" />
        </div>
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-toy w-full" placeholder="Phone" />
        <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-toy w-full" placeholder="Street Address" />
        <div className="grid gap-4 sm:grid-cols-3">
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-toy" placeholder="City" />
          <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input-toy" placeholder="Area" />
          <input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="input-toy" placeholder="Postal Code" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={!!form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
          Set as default address
        </label>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            {editingId ? 'Save Changes' : 'Add Address'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div key={addr._id} className="card-toy p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{addr.fullName}</span>
                  {addr.isDefault && <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Default</span>}
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {addr.address}, {addr.area}, {addr.city} {addr.postalCode}
                </p>
                <p className="text-sm text-gray-500">Phone: {addr.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(addr)} className="text-sm text-blue-600 hover:underline">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => addr._id && deleteAddress(addr._id)} className="text-sm text-red-600 hover:underline">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WishlistTab() {
  const { data: wishlistsData } = useGetWishlistsQuery()
  const [deleteWishlist] = useDeleteWishlistMutation()
  const wishlists = wishlistsData?.data || []

  return (
    <div className="card-toy p-6">
      <h2 className="mb-6 font-semibold">My Wishlists</h2>
      {wishlists.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p>
            No wishlists yet.{' '}
            <Link to="/shop" className="text-blue-600">
              Browse products
            </Link>{' '}
            and save your favorites.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlists.map((wl) => (
            <div key={wl._id} className="card-toy p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium">{wl.name}</span>
                  <span className="text-sm text-gray-500">{wl.products?.length || 0} items</span>
                </div>
                <button onClick={() => deleteWishlist(wl._id)} className="text-sm text-red-600 hover:underline">
                  Delete
                </button>
              </div>
              {wl.products && wl.products.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {wl.products.slice(0, 4).map((item) => (
                    <Link key={item._id} to={`/product/${item.product?.slug || ''}`} className="card-toy overflow-hidden">
                      <img src={item.product?.images?.[0]?.url} alt={item.product?.name} className="aspect-square w-full object-cover" />
                      <div className="p-2">
                        <p className="line-clamp-1 text-xs font-medium">{item.product?.name}</p>
                        <p className="text-xs font-bold text-gray-900">
                          Rs. {((item.product?.salePrice ?? item.product?.price) || 0).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function LoyaltyTab() {
  const user = useAppSelector((s) => s.auth.user)
  const tiers = ['bronze', 'silver', 'gold', 'vip']
  const tierInfo: Record<string, string> = {
    bronze: 'Earn points on every purchase',
    silver: '5% bonus points + free shipping',
    gold: '10% bonus points + exclusive deals',
    vip: '15% bonus points + priority support',
  }

  return (
    <div className="card-toy p-6">
      <h2 className="mb-6 font-semibold">Loyalty Program</h2>
      <div className="mb-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Current Tier</p>
            <p className="text-3xl font-bold capitalize">{user?.loyaltyTier || 'bronze'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Points</p>
            <p className="text-4xl font-bold">{user?.loyaltyPoints || 0}</p>
          </div>
        </div>
      </div>
      <p className="mb-6 text-gray-600">Earn 1 point for every Rs. 100 spent. Redeem points for discounts on future orders.</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier} className={`rounded-xl p-4 ${user?.loyaltyTier === tier ? 'border-2 border-blue-500 bg-blue-50' : 'border border-gray-200'}`}>
            <h3 className="font-medium capitalize">{tier}</h3>
            <p className="mt-1 text-sm text-gray-500">{tierInfo[tier]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
