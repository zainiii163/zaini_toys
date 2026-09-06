import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown } from 'lucide-react'
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
    navigate(`/shop?search=${encodeURIComponent(search)}`)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-blue-600 py-1.5 text-center text-xs font-medium text-white">
        Free shipping on orders over Rs. 3,000 🎉
      </div>

      {/* Main bar */}
      <div className="container-toy flex h-16 items-center justify-between gap-4">
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
            T
          </span>
          <span className="font-display text-xl font-semibold text-gray-900">Toy Shop</span>
        </Link>

        {/* Category dropdown */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setCatOpen(!catOpen)}
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Categories <ChevronDown className="h-4 w-4" />
          </button>
          {catOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setCatOpen(false)}
              onMouseEnter={() => setCatOpen(false)}
            />
          )}
          {catOpen && (
            <div className="absolute left-0 z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/shop?category=${cat.slug}`}
                  onClick={() => setCatOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <form onSubmit={onSearch} className="hidden flex-1 max-w-xl md:flex">
          <div className="flex w-full items-center rounded-full border border-gray-300 bg-gray-50 px-4 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search toys, brands, categories..."
              className="w-full bg-transparent px-3 py-2 text-sm outline-none"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link to={auth.isAuthenticated ? '/account' : '/login'} className="rounded-full p-2 hover:bg-gray-100" aria-label="Account">
            <User className="h-6 w-6 text-gray-700" />
          </Link>
          <Link to="/wishlist" className="rounded-full p-2 hover:bg-gray-100" aria-label="Wishlist">
            <Heart className="h-6 w-6 text-gray-700" />
          </Link>
          <Link to="/cart" className="relative rounded-full p-2 hover:bg-gray-100" aria-label="Cart">
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 lg:hidden">
          <form onSubmit={onSearch} className="mt-3">
            <div className="flex items-center rounded-full border border-gray-300 bg-gray-50 px-4">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search toys..."
                className="w-full bg-transparent px-3 py-2 text-sm outline-none"
              />
            </div>
          </form>
          <nav className="mt-3 space-y-1">
            <NavLink to="/" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Home</NavLink>
            <NavLink to="/shop" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Shop All</NavLink>
            {categories.map((cat) => (
              <NavLink
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </NavLink>
            ))}
            {auth.isAuthenticated ? (
              <>
                <NavLink to="/account" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>My Account</NavLink>
                <NavLink to="/account/orders" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>My Orders</NavLink>
              </>
            ) : (
              <NavLink to="/login" className="block rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Login</NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
