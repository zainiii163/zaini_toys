import { Link } from 'react-router-dom'
import { ThumbsUp, Camera, Music2, Play, Phone, Mail, MapPin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  SITE_NAME, SITE_TAGLINE, SOCIALS, PAYMENT_METHODS, COURIERS, STORE_HELP, FOOTER_LINKS,
} from '../../config/site'
import type { SocialIcon } from '../../config/site'

const SOCIAL_ICONS: Record<SocialIcon, LucideIcon> = {
  facebook: ThumbsUp,
  instagram: Camera,
  tiktok: Music2,
  youtube: Play,
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-900 text-gray-300">
      {/* Main columns */}
      <div className="container-toy grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal-400 text-lg font-bold text-white">
              T
            </div>
            <div>
              <p className="font-display text-lg font-semibold leading-tight text-white">{SITE_NAME}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-teal-400">{SITE_TAGLINE}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Pakistan's favorite destination for safe, fun, and educational toys for kids of all ages — brightening little faces since day one.
          </p>
          <div className="mt-4 flex gap-2">
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon]
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-primary hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Shop</h3>
          <ul className="space-y-2 text-sm">
            {FOOTER_LINKS.shop.map((l) => (
              <li key={l.label}><Link to={l.to} className="hover:text-teal-400 transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Company</h3>
          <ul className="space-y-2 text-sm">
            {FOOTER_LINKS.company.map((l) => (
              <li key={l.label}><Link to={l.to} className="hover:text-teal-400 transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Help</h3>
          <ul className="space-y-2 text-sm">
            {FOOTER_LINKS.help.map((l) => (
              <li key={l.label}><Link to={l.to} className="hover:text-teal-400 transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Help + payments/delivery */}
      <div className="border-t border-gray-800">
        <div className="container-toy grid gap-8 py-8 sm:grid-cols-2">
          <div>
            <p className="font-display text-lg font-semibold text-white">We're Here To Help!</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-teal-400" /> {STORE_HELP.address}</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-teal-400" /> <a href={STORE_HELP.phoneHref} className="hover:text-gray-200">{STORE_HELP.phone}</a></li>
              <li className="flex items-center gap-2">
                <span>💬</span>
                <a href={STORE_HELP.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">WhatsApp: {STORE_HELP.whatsapp}</a>
              </li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-teal-400" /> <a href={STORE_HELP.emailHref} className="hover:text-gray-200">{STORE_HELP.email}</a></li>
              <li className="flex items-center gap-2"><span>🕘</span> {STORE_HELP.hours}</li>
            </ul>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white">Secure Payments</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((p) => (
                  <span key={p} className="rounded-md border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-200">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white">Fast &amp; Reliable Delivery</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {COURIERS.map((c) => (
                  <span key={c} className="rounded-md border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-200">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. |{' '}
        <Link to="/about" className="hover:text-gray-300">About</Link> |{' '}
        <Link to="/terms" className="hover:text-gray-300">Terms</Link> |{' '}
        <Link to="/privacy" className="hover:text-gray-300">Privacy</Link> |{' '}
        <Link to="/contact" className="hover:text-gray-300">Contact</Link>
        <span className="mx-2 text-gray-700">|</span>
        Made with <span className="text-red-500">❤️</span> in Pakistan
      </div>
    </footer>
  )
}