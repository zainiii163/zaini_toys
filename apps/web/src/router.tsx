import { createBrowserRouter } from 'react-router-dom'
import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks/typed'
import { setUser, setBootstrapDone } from './store/authSlice'
import { useGetMeQuery } from './app/services/auth'

import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import AccountPage from './pages/AccountPage'
import { ProfileTab, OrdersTab, AddressesTab, WishlistTab, LoyaltyTab } from './pages/AccountPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import WishlistPage from './pages/WishlistPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import FaqPage from './pages/FaqPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import SupportPage from './pages/SupportPage'
import TicketDetailPage from './pages/TicketDetailPage'
import GiftFinderPage from './pages/GiftFinderPage'
import ComparePage from './pages/ComparePage'
import SizeGuidePage from './pages/SizeGuidePage'
import WholesalePage from './pages/WholesalePage'
import StoreLocationsPage from './pages/StoreLocationsPage'
import ReferralPage from './pages/ReferralPage'
import GiftCardPage from './pages/GiftCardPage'
import AccessibilityPage from './pages/AccessibilityPage'

// Bootstrap component to validate session on first load
function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { data, isSuccess, isError } = useGetMeQuery()

  useEffect(() => {
    if (isSuccess && data?.data?.user) {
      dispatch(setUser(data.data.user))
    }
    if (isSuccess || isError) {
      dispatch(setBootstrapDone())
    }
  }, [data, isSuccess, isError, dispatch])

  return <>{children}</>
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAppSelector((s) => s.auth)
  const location = useLocation()

  if (!auth.bootstrapDone) return null
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthBootstrap>
        <Layout />
      </AuthBootstrap>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: 'shop', element: <ShopPage /> },
      { path: 'product/:slug', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'order-success/:orderNumber', element: <OrderSuccessPage /> },
      { path: 'orders/track/:orderNumber', element: <OrderTrackingPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
      { path: 'gift-finder', element: <GiftFinderPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'support/:id', element: <TicketDetailPage /> },
      { path: 'size-guide', element: <SizeGuidePage /> },
      { path: 'wholesale', element: <WholesalePage /> },
      { path: 'stores', element: <StoreLocationsPage /> },
      { path: 'refer', element: <ReferralPage /> },
      { path: 'gift-cards', element: <GiftCardPage /> },
      { path: 'accessibility', element: <AccessibilityPage /> },
      {
        path: 'account',
        element: (
          <RequireAuth>
            <AccountPage />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <ProfileTab /> },
          { path: 'profile', element: <ProfileTab /> },
          { path: 'orders', element: <OrdersTab /> },
          { path: 'orders/:orderId', element: <OrdersTab /> },
          { path: 'addresses', element: <AddressesTab /> },
          { path: 'wishlist', element: <WishlistTab /> },
          { path: 'loyalty', element: <LoyaltyTab /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

function NotFound() {
  return (
    <div className="container-toy py-20 text-center">
      <p className="text-6xl">🧸</p>
      <h1 className="mt-4 font-display text-3xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary mt-6 inline-block">Back to Home</a>
    </div>
  )
}
