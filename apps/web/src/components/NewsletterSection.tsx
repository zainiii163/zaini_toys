import { useState } from 'react'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    toast.success('Subscribed! Check your inbox for a welcome discount.')
    setEmail('')
  }

  return (
    <section className="bg-gradient-to-r from-blue-600 to-teal-500 py-12">
      <div className="container-toy text-center">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Stay Updated</h2>
        <p className="mx-auto mt-2 max-w-md text-blue-100">
          Get the latest deals, new arrivals, and parenting tips delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-toy w-full pl-10"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}
