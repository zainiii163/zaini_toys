import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Globe, Camera, MessageCircle, Play } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="container-toy grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-3 font-display text-lg font-semibold text-white">Toy Shop</h3>
          <p className="text-sm text-gray-400">
            Pakistan's favorite destination for safe, fun, and educational toys for kids of all ages.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-white">All Toys</Link></li>
            <li><Link to="/shop?newArrival=true" className="hover:text-white">New Arrivals</Link></li>
            <li><Link to="/shop?bestSeller=true" className="hover:text-white">Best Sellers</Link></li>
            <li><Link to="/shop?onSale=true" className="hover:text-white">Deals &amp; Offers</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Help</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/account" className="hover:text-white">Track Order</Link></li>
            <li><Link to="/account" className="hover:text-white">Returns &amp; Exchanges</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0300-1234567</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@toyshop.pk</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Karachi, Pakistan</li>
          </ul>
          <div className="mt-4 flex gap-3">
            <Camera className="h-5 w-5 cursor-pointer hover:text-white" />
            <Globe className="h-5 w-5 cursor-pointer hover:text-white" />
            <MessageCircle className="h-5 w-5 cursor-pointer hover:text-white" />
            <Play className="h-5 w-5 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Toy Shop. All rights reserved. |{' '}
        <Link to="/about" className="hover:text-gray-300">About</Link> |{' '}
        <Link to="/terms" className="hover:text-gray-300">Terms</Link> |{' '}
        <Link to="/privacy" className="hover:text-gray-300">Privacy</Link> |{' '}
        <Link to="/contact" className="hover:text-gray-300">Contact</Link>
      </div>
    </footer>
  )
}
