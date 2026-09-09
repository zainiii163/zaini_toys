import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gift, CreditCard, Send, Check, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

const DENOMINATIONS = [500, 1000, 1500, 2000, 3000, 5000]

export default function GiftCardPage() {
  const [denomination, setDenomination] = useState(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [purchased, setPurchased] = useState(false)
  const [giftCode, setGiftCode] = useState('')

  const finalAmount = customAmount ? Number(customAmount) : denomination

  const onPurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipientName || !recipientEmail || !senderName) {
      toast.error('Please fill in all required fields')
      return
    }
    if (finalAmount < 100 || finalAmount > 10000) {
      toast.error('Amount must be between Rs. 100 and Rs. 10,000')
      return
    }
    // Simulate purchase
    const code = 'GIFT-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setGiftCode(code)
    setPurchased(true)
    toast.success('Gift card purchased successfully!')
  }

  if (purchased) {
    return (
      <div className="container-toy py-20 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
            <Gift className="mx-auto h-12 w-12" />
            <h1 className="mt-3 font-display text-2xl font-bold">Gift Card Sent!</h1>
            <p className="mt-2 text-purple-100">Rs. {finalAmount.toLocaleString()} gift card sent to {recipientEmail}</p>
          </div>
          <div className="card-toy p-6">
            <p className="text-sm text-gray-500">Gift Card Code</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="font-mono text-2xl font-bold tracking-wider">{giftCode}</span>
              <button onClick={() => { navigator.clipboard.writeText(giftCode); toast.success('Copied!') }} className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              This code has been emailed to {recipientEmail}. It can be used at checkout.
            </p>
          </div>
          <Link to="/" className="btn-primary mt-6 inline-block">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-toy py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-900">Gift Cards</span>
      </nav>

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <span className="text-5xl">🎁</span>
          <h1 className="mt-3 font-display text-3xl font-bold">Gift Cards</h1>
          <p className="mt-2 text-gray-600">Give the gift of choice! Let them pick their favorite toys.</p>
        </div>

        <form onSubmit={onPurchase} className="card-toy p-6">
          {/* Amount */}
          <div className="mb-6">
            <h2 className="mb-3 font-semibold">Select Amount</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {DENOMINATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => { setDenomination(d); setCustomAmount('') }}
                  className={`rounded-xl border-2 p-3 text-center transition-all ${
                    denomination === d && !customAmount ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-lg font-bold">Rs. {d.toLocaleString()}</p>
                </button>
              ))}
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-sm font-medium">Custom Amount (Rs. 100 – 10,000)</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min={100}
                max={10000}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                placeholder="Enter custom amount"
              />
            </div>
          </div>

          {/* Recipient */}
          <div className="mb-6">
            <h2 className="mb-3 font-semibold">Recipient Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Recipient Name *</label>
                <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="input-toy w-full" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Recipient Email *</label>
                <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="input-toy w-full" required />
              </div>
            </div>
          </div>

          {/* Sender */}
          <div className="mb-6">
            <h2 className="mb-3 font-semibold">Your Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Your Name *</label>
                <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="input-toy w-full" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Personal Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} className="input-toy w-full" placeholder="Happy Birthday! Enjoy some toys!" maxLength={200} />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-xl bg-purple-50 p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="font-medium">Gift Card Value</span>
              <span className="text-2xl font-bold text-purple-700">Rs. {finalAmount.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <Gift className="h-5 w-5" /> Purchase Gift Card — Rs. {finalAmount.toLocaleString()}
          </button>
        </form>

        {/* Info */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Gift, title: 'Instant Delivery', desc: 'Sent via email within minutes' },
            { icon: CreditCard, title: 'Flexible Amount', desc: 'Rs. 100 to Rs. 10,000' },
            { icon: Check, title: 'No Expiry', desc: 'Valid forever, no hidden fees' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-toy p-4 text-center">
              <Icon className="mx-auto h-8 w-8 text-purple-600" />
              <h3 className="mt-2 font-semibold text-sm">{title}</h3>
              <p className="mt-1 text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
