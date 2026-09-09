import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch } from './hooks/typed'
import { setUser, setBootstrapDone } from './store/authSlice'
import { useGetMeQuery } from './app/services/auth'

import AdminLayout from './components/AdminLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import ProductFormPage from './pages/ProductFormPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import CustomersPage from './pages/CustomersPage'
import CategoriesPage from './pages/CategoriesPage'
import BrandsPage from './pages/BrandsPage'
import CouponsPage from './pages/CouponsPage'
import BannersPage from './pages/BannersPage'
import FlashSalesPage from './pages/FlashSalesPage'
import ReviewsPage from './pages/ReviewsPage'
import SupportPage from './pages/SupportPage'
import SettingsPage from './pages/SettingsPage'
import TeamPage from './pages/TeamPage'
import AuditLogPage from './pages/AuditLogPage'
import ReportsPage from './pages/ReportsPage'
import BlogManagerPage from './pages/BlogManagerPage'
import NotificationsPage from './pages/NotificationsPage'
import CustomerDetailPage from './pages/CustomerDetailPage'
import InventoryLogPage from './pages/InventoryLogPage'
import CouponAnalyticsPage from './pages/CouponAnalyticsPage'
import ReturnsPage from './pages/ReturnsPage'

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

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <AuthBootstrap>
        <AdminLayout />
      </AuthBootstrap>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/new', element: <ProductFormPage /> },
      { path: 'products/:id/edit', element: <ProductFormPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'returns', element: <ReturnsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'customers/:id', element: <CustomerDetailPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'brands', element: <BrandsPage /> },
      { path: 'coupons', element: <CouponsPage /> },
      { path: 'banners', element: <BannersPage /> },
      { path: 'flash-sales', element: <FlashSalesPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'audit-log', element: <AuditLogPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'analytics', element: <CouponAnalyticsPage /> },
      { path: 'inventory-log', element: <InventoryLogPage /> },
      { path: 'blog', element: <BlogManagerPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { index: true, element: <DashboardPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
