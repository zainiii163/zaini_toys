import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import SocialProof from '../SocialProof'
import BackToTop from '../BackToTop'
import LiveChat from '../LiveChat'
import ScrollProgress from '../ScrollProgress'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ScrollProgress />
      <Header />
      <main className="flex-1">
        <div key={pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
      <SocialProof />
      <BackToTop />
      <LiveChat />
      <ScrollRestoration />
    </div>
  )
}
