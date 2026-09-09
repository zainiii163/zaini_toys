import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Building2, Package, Phone, Mail, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WholesalePage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    city: '',
    businessType: '',
    estimatedVolume: '',
    message: '',
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.businessName || !form.contactName || !form.email || !form.phone) {
      toast.error('Please fill in all required fields')
      return
    }
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitted(true)
    toast.success('Inquiry submitted! Our team will contact you within 24 hours.')
  }

  if (submitted) {
    return (
      <div className="container-toy py-20 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 font-display text-3xl font-bold">Thank You!</h1>
        <p className="mt-2 text-gray-600">Your wholesale inquiry has been submitted. Our business team will contact you within 24 hours.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-block">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container-toy py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-900">Wholesale</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <span className="text-5xl">🏢</span>
          <h1 className="mt-3 font-display text-3xl font-bold">Wholesale & Bulk Orders</h1>
          <p className="mt-2 text-gray-600">Special pricing for retailers, schools, and organizations. Get toys at wholesale rates.</p>
        </div>

        {/* Benefits */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Package, title: 'Bulk Discounts', desc: 'Up to 40% off on orders of 50+ units' },
            { icon: Building2, title: 'Business Account', desc: 'Dedicated account manager & credit terms' },
            { icon: Truck, title: 'Free Shipping', desc: 'Free delivery on wholesale orders' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-toy p-4 text-center">
              <Icon className="mx-auto h-8 w-8 text-blue-600" />
              <h3 className="mt-2 font-semibold text-sm">{title}</h3>
              <p className="mt-1 text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="card-toy p-6">
          <h2 className="mb-4 font-semibold">Wholesale Inquiry</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Business Name *</label>
              <input type="text" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="input-toy w-full" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Contact Person *</label>
              <input type="text" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className="input-toy w-full" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-toy w-full" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-toy w-full" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">City</label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-toy w-full" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Business Type</label>
              <select value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} className="input-toy w-full">
                <option value="">Select type</option>
                <option value="retailer">Retailer / Shop</option>
                <option value="school">School / Daycare</option>
                <option value="distributor">Distributor</option>
                <option value="corporate">Corporate / Gifting</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium">Estimated Monthly Volume</label>
            <select value={form.estimatedVolume} onChange={(e) => setForm({ ...form, estimatedVolume: e.target.value })} className="input-toy w-full">
              <option value="">Select volume</option>
              <option value="50-100">50–100 units</option>
              <option value="100-500">100–500 units</option>
              <option value="500-1000">500–1,000 units</option>
              <option value="1000+">1,000+ units</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium">Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="input-toy w-full" placeholder="Tell us about your business and what products you're interested in..." />
          </div>
          <button type="submit" className="btn-primary mt-4 flex items-center gap-2">
            <Send className="h-4 w-4" /> Submit Inquiry
          </button>
        </form>
      </div>
    </div>
  )
}
