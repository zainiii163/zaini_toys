import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Phone,
} from 'lucide-react'
import { useAppSelector } from '../../hooks/typed'
import { useGetCategoryTreeQuery } from '../../app/services/category'
import { useGetCartQuery } from '../../app/services/cart'
import SearchAutocomplete from '../SearchAutocomplete'
import DarkModeToggle from '../DarkModeToggle'
import {
  ANNOUNCEMENTS, TRUST_ITEMS, AGE_GROUPS, BUDGET_RANGES, STORE_HELP, SITE_NAME, SITE_TAGLINE,
} from '../../config/site'

const ageUrl = (g: { ageMin: number; ageMax: number }) => `/shop?ageMin=${g.ageMin}&ageMax=${g.ageMax}`
const budgetUrl = (b: { max: number }) => `/shop?maxPrice=${b.max}`

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [megaOpen, setMegaOpen] = useState(false)
  const [annIdx, setAnnIdx] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAppSelector((s) => s.auth)
  const { data: categoriesData } = useGetCategoryTreeQuery()
  const { data: cartData } = useGetCartQuery(undefined, { skip: !auth.isAuthenticated })

  const cartCount = cartData?.data?.totalItems ?? 0
  const categories = categoriesData?.data ?? []
  const announcement = ANNOUNCEMENTS[annIdx % ANNOUNCEMENTS.length]

  useEffect(() => {
    const t = setInterval(() => setAnnIdx((i) => (i + 1) % ANNOUNCEMENTS.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMegaOpen(false)
    setMobileOpen(false)
  }, [location.pathname, location.search])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md shadow-blue-100/60' : 'shadow-sm'}`}>
      {/* Announcement bar */}
      <div className="bg-blue-950 text-white">
        <div className="container-toy grid grid-cols-1 items-center gap-1 py-1.5 text-xs md:grid-cols-3">
          <div className="hidden items-center gap-2 text-blue-200 md:flex">
            <a href={STORE_HELP.phoneHref} className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="h-3 w-3" /> {STORE_HELP.phone}
            </a>
            <span className="text-blue-700">|</span>
            <span>Hours: {STORE_HELP.hours}</span>
          </div>
          <div className="flex items-center justify-center text-center">
            <Link
              key={annIdx}
              to={announcement.link}
              className="announce-fade inline-flex items-center gap-1 font-medium hover:underline"
            >
              {announcement.text}
            </Link>
          </div>
          <div className="hidden items-center justify-end gap-3 text-blue-200 md:flex">
            <Link to="/account/orders" className="hover:text-white transition-colors">Track Order</Link>
            <span className="text-blue-700">|</span>
            <Link to="/contact" className="hover:text-white transition-colors">Help</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container-toy flex h-16 items-center justify-between gap-3">
          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="group flex shrink-0 items-center gap-2">
            <div className="animate-wiggle flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal-400 text-xl font-bold text-white shadow-md shadow-blue-200">
              T
            </div>
            <div className="hidden sm:block">
              <span className="block font-display text-lg font-bold leading-tight text-gray-900">{SITE_NAME}</span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-primary">{SITE_TAGLINE}</span>
            </div>
          </Link>

          {/* Search */}
          <div className="hidden flex-1 justify-center md:flex">
            <SearchAutocomplete />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <DarkModeToggle />
            <Link to={auth.isAuthenticated ? '/account' : '/login'} className="group hidden flex-col items-center rounded-lg px-2.5 py-1.5 hover:bg-gray-100 sm:flex transition-colors">
              <User className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-primary hidden sm:block">
                {auth.isAuthenticated ? 'Account' : 'Login / Register'}
              </span>
            </Link>
            <Link to="/wishlist" className="group hidden flex-col items-center rounded-lg px-2.5 py-1.5 hover:bg-gray-100 md:flex transition-colors">
              <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors" />
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-red-500 hidden sm:block">Wishlist</span>
            </Link>
            <Link to="/cart" className="group relative flex flex-col items-center rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition-colors">
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <span key={cartCount} className="animate-pop absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-primary hidden sm:block">Cart</span>
            </Link>
          </div>
        </div>

        {/* Desktop nav + mega menu */}
        <nav className="hidden lg:block border-t border-gray-100 bg-white">
          <div className="container-toy relative flex items-center justify-between">
            <div className="flex items-center gap-5 py-2">
              <button
                onClick={() => setMegaOpen(!megaOpen)}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                <Menu className="h-4 w-4" /> Categories
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
              </button>
              <Link to="/shop?newArrival=true" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">New Arrivals</Link>
              <Link to="/shop?onSale=true" className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">Deals 🔥</Link>
              <Link to="/gift-finder" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">Gift Finder</Link>
            </div>
            <div className="flex items-center gap-5 text-xs text-gray-600">
              {TRUST_ITEMS.map((item) => (
                <Link key={item.text} to={item.link} className="flex items-center gap-1 whitespace-nowrap hover:text-primary transition-colors">
                  <span>{item.emoji}</span> {item.text}
                </Link>
              ))}
            </div>

            {megaOpen && (
              <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setMegaOpen(false)} />
            )}
            {megaOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Shop by Age</p>
                    <div className="grid grid-cols-2 gap-1">
                      {AGE_GROUPS.map((g) => (
                        <Link
                          key={g.label}
                          to={ageUrl(g)}
                          onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors"
                        >
                          <span className="text-base">{g.emoji}</span> {g.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Shop by Budget</p>
                    <div className="grid grid-cols-1 gap-1">
                      {BUDGET_RANGES.map((b) => (
                        <Link
                          key={b.label}
                          to={budgetUrl(b)}
                          onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <span className="text-base">{b.emoji}</span> {b.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Top Categories</p>
                    <div className="grid grid-cols-1 gap-1">
                      {categories.slice(0, 10).map((cat) => (
                        <Link
                          key={cat._id}
                          to={`/shop?category=${cat.slug}`}
                          onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors"
                        >
                          <span className="text-base">{cat.icon || '📦'}</span> {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-span-3 mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-400">{categories.length} categories · {SITE_NAME}</span>
                  <Link to="/shop" onClick={() => setMegaOpen(false)} className="text-sm font-semibold text-primary hover:underline">
                    View All Products →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile trust strip */}
        <div className="overflow-x-auto border-t border-gray-100 bg-gray-50 lg:hidden">
          <div className="container-toy flex items-center gap-5 whitespace-nowrap py-1.5 text-[11px] text-gray-600">
            {TRUST_ITEMS.map((item) => (
              <Link key={item.text} to={item.link} className="flex items-center gap-1">
                <span>{item.emoji}</span> {item.text}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-gray-200 bg-white px-4 pb-4 lg:hidden">
            <form onSubmit={onSearch} className="mt-3">
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-blue-100">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search toys..."
                  className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                />
                <button type="submit" className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white">Go</button>
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

              <p className="px-3 py-1 text-xs font-semibold uppercase text-gray-400">Shop by Age</p>
              {AGE_GROUPS.map((g) => (
                <NavLink key={g.label} to={ageUrl(g)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                  <span className="text-sm">{g.emoji}</span> {g.label}
                </NavLink>
              ))}

              <p className="mt-2 px-3 py-1 text-xs font-semibold uppercase text-gray-400">Shop by Budget</p>
              {BUDGET_RANGES.map((b) => (
                <NavLink key={b.label} to={budgetUrl(b)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                  <span className="text-sm">{b.emoji}</span> {b.label}
                </NavLink>
              ))}

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
                <NavLink to="/login" className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white" onClick={() => setMobileOpen(false)}>
                  <User className="h-4 w-4" /> Login / Sign Up
                </NavLink>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}