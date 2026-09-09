import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Phone, Truck, Shield, RotateCcw } from 'lucide-react'
import { useAppSelector } from '../../hooks/typed'
import { useGetCategoryTreeQuery } from '../../app/services/category'
import { useGetCartQuery } from '../../app/services/cart'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const navigate = useNavigate()
  const auth = useAppSelector((s) => s.auth)
  const { data: categoriesData } = useGetCategoryTreeQuery()
  const { data: cartData } = useGetCartQuery(undefined, { skip: !auth.isAuthenticated })

  const cartCount = cartData?.data?.totalItems ?? 0
  const categories = categoriesData?.data ?? []

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-slate-900 text-slate-300">
        <div className="container-toy flex items-center justify-between py-1.5 text-xs">
          <div className="flex items-center gap-4">
            <a href="tel:+923001234567" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="h-3 w-3" /> 0300-1234567
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">Free shipping on orders over Rs. 3,000</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/shop" className="hover:text-white transition-colors">Track Order</Link>
            <span className="text-slate-600">|</span>
            <Link to="/shop" className="hover:text-white transition-colors">Help</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container-toy flex h-16 items-center justify-between gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-md shadow-blue-200">
              <span className="text-xl font-bold text-white">T</span>
            </div>
            <div className="hidden sm:block">
              <span className="block font-display text-lg font-bold leading-tight text-gray-900">Toy Shop</span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-blue-600">Pakistan's #1 Toy Store</span>
            </div>
          </Link>

          {/* Category dropdown */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all"
            >
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              Categories
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
            {catOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setCatOpen(false)}
              />
            )}
            {catOpen && (
              <div className="absolute left-0 z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/shop?category=${cat.slug}`}
                    onClick={() => setCatOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-base">{cat.icon || '📦'}</span>
                    {cat.name}
                  </Link>
                ))}
                <div className="mx-4 my-2 border-t border-gray-100" />
                <Link
                  to="/shop"
                  onClick={() => setCatOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  View All Products →
                </Link>
              </div>
            )}
          </div>

          {/* Search */}
          <form onSubmit={onSearch} className="hidden flex-1 max-w-xl md:flex">
            <div className="flex w-full items-center rounded-xl border border-gray-200 bg-gray-50 px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search toys, brands, categories..."
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
              />
              <button type="submit" className="shrink-0 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <Link to={auth.isAuthenticated ? '/account' : '/login'} className="flex flex-col items-center rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition-colors group">
              <User className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-blue-600 hidden sm:block">{auth.isAuthenticated ? 'Account' : 'Login'}</span>
            </Link>
            <Link to="/wishlist" className="flex flex-col items-center rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition-colors group">
              <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors" />
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-red-500 hidden sm:block">Wishlist</span>
            </Link>
            <Link to="/cart" className="relative flex flex-col items-center rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition-colors group">
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-blue-600 hidden sm:block">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="hidden lg:block bg-gray-50 border-b border-gray-100">
        <div className="container-toy flex items-center justify-center gap-8 py-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-blue-600" />
            <span>Free Delivery Over Rs. 3,000</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-green-600" />
            <span>100% Authentic Products</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5 text-orange-600" />
            <span>7-Day Easy Returns</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span>Secure COD Payment</span>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 lg:hidden shadow-lg">
          <form onSubmit={onSearch} className="mt-3">
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search toys..."
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
              />
              <button type="submit" className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">Go</button>
            </div>
          </form>
          <nav className="mt-3 space-y-0.5">
            <NavLink to="/" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
              <span className="text-base">🏠</span> Home
            </NavLink>
            <NavLink to="/shop" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
              <span className="text-base">🛍️</span> Shop All
            </NavLink>
            <div className="my-2 border-t border-gray-100" />
            <p className="px-3 py-1 text-xs font-semibold uppercase text-gray-400">Categories</p>
            {categories.map((cat) => (
              <NavLink
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-sm">{cat.icon || '📦'}</span>
                {cat.name}
              </NavLink>
            ))}
            <div className="my-2 border-t border-gray-100" />
            {auth.isAuthenticated ? (
              <>
                <NavLink to="/account" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                  <User className="h-4 w-4" /> My Account
                </NavLink>
                <NavLink to="/account/orders" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                  <span className="text-base">📦</span> My Orders
                </NavLink>
              </>
            ) : (
              <NavLink to="/login" className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100" onClick={() => setMobileOpen(false)}>
                <User className="h-4 w-4" /> Login / Sign Up
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
