import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Layers, Image, Zap, Settings, Percent, LifeBuoy, LogOut, ChevronLeft, ChevronRight, Shield, Clock, BarChart3, FileText, Bell, BoxSelect } from 'lucide-react'
import { useState } from 'react'
import { useLogoutMutation } from '../app/services/auth'
import { useAppDispatch } from '../hooks/typed'
import { logout } from '../store/authSlice'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/categories', label: 'Categories', icon: Layers },
  { to: '/brands', label: 'Brands', icon: Tag },
  { to: '/coupons', label: 'Coupons', icon: Percent },
  { to: '/banners', label: 'Banners', icon: Image },
  { to: '/flash-sales', label: 'Flash Sales', icon: Zap },
  { to: '/reviews', label: 'Reviews', icon: LifeBuoy },
  { to: '/support', label: 'Support', icon: LifeBuoy },
  { to: '/blog', label: 'Blog', icon: FileText },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/team', label: 'Team', icon: Shield },
  { to: '/audit-log', label: 'Audit Log', icon: Clock },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/inventory-log', label: 'Inventory Log', icon: BoxSelect },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [logoutApi] = useLogoutMutation()

  const handleLogout = async () => {
    await logoutApi().unwrap().catch(() => {})
    dispatch(logout())
    navigate('/login')
  }

  return (
    <aside className={`flex flex-col border-r border-gray-200 bg-white transition-all ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {!collapsed && <span className="font-display text-lg font-bold text-blue-600">Admin</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="rounded-lg p-1 hover:bg-gray-100">
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-gray-200 p-3">
        <button onClick={handleLogout} className="sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-600" title={collapsed ? 'Sign Out' : undefined}>
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
