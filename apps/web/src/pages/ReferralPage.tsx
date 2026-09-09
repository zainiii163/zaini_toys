import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gift, Share2, Copy, Check, Users, DollarSign, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppSelector } from '../hooks/typed'

export default function ReferralPage() {
  const auth = useAppSelector((s) => s.auth)
  const [copied, setCopied] = useState(false)
  const referralCode = auth.user?.referralCode || 'TOY' + Math.random().toString(36).substring(2, 8).toUpperCase()
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`

  const onCopy = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('Referral link copied!')
    setTimeout(() => setCopied(false), 3000)
  }

  const onShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Toy Shop Pakistan',
          text: `Use my referral link to get Rs. 500 off your first order! ${referralLink}`,
          url: referralLink,
        })
      } catch {}
    } else {
      onCopy()
    }
  }

  const steps = [
    { icon: Share2, title: 'Share Your Link', desc: 'Send your unique referral link to friends & family' },
    { icon: Users, title: 'Friend Signs Up', desc: 'They create an account using your link' },
    { icon: Gift, title: 'Both Get Rewarded', desc: 'You get Rs. 500 credit, they get Rs. 500 off first order' },
  ]

  return (
    <div className="container-toy py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-900">Refer & Earn</span>
      </nav>

      <div className="mx-auto max-w-2xl">
        {/* Hero */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-center text-white">
          <span className="text-5xl">🎁</span>
          <h1 className="mt-3 font-display text-3xl font-bold">Refer & Earn</h1>
          <p className="mt-2 text-purple-100">Share the joy of toys! Earn Rs. 500 for every friend who joins.</p>
        </div>

        {/* Referral Link */}
        {auth.isAuthenticated && (
          <div className="card-toy mb-8 p-6">
            <h2 className="mb-3 font-semibold">Your Referral Link</h2>
            <div className="flex gap-2">
              <div className="flex-1 overflow-hidden rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 truncate">
                {referralLink}
              </div>
              <button onClick={onCopy} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={onShare} className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Your code: <span className="font-mono font-bold">{referralCode}</span></p>
          </div>
        )}

        {!auth.isAuthenticated && (
          <div className="card-toy mb-8 p-6 text-center">
            <p className="text-gray-600">Login to get your unique referral link and start earning rewards!</p>
            <Link to="/login" className="btn-primary mt-4 inline-block">Login / Sign Up</Link>
          </div>
        )}

        {/* How it works */}
        <div className="mb-8">
          <h2 className="mb-4 text-center text-xl font-semibold">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="card-toy p-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white mx-auto -mt-3 relative z-10">{i + 1}</div>
                <h3 className="mt-2 font-semibold text-sm">{title}</h3>
                <p className="mt-1 text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="card-toy p-6">
          <h2 className="mb-4 font-semibold">Reward Tiers</h2>
          <div className="space-y-3">
            {[
              { referrals: 1, reward: 'Rs. 500 credit', badge: 'Starter' },
              { referrals: 5, reward: 'Rs. 3,000 credit + Free Shipping', badge: 'Advocate' },
              { referrals: 10, reward: 'Rs. 7,500 credit + VIP Badge', badge: 'Champion' },
              { referrals: 25, reward: 'Rs. 20,000 credit + Exclusive Perks', badge: 'Legend' },
            ].map((tier) => (
              <div key={tier.badge} className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-sm">{tier.badge}</p>
                    <p className="text-xs text-gray-500">{tier.referrals} referral{tier.referrals > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-600">{tier.reward}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Referral rewards are credited after the referred friend completes their first order (min. Rs. 1,000).</p>
          <p className="mt-1">Maximum 50 referrals per account. <Link to="/terms" className="underline">Full terms</Link></p>
        </div>
      </div>
    </div>
  )
}
