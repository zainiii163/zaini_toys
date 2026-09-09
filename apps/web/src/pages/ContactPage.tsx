import { useState } from 'react'
import { Phone, Mail, MapPin, Send, Clock, Globe, Camera, MessageCircle, Play } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.")
      setForm({ name: '', email: '', subject: '', message: '' })
      setSending(false)
    }, 1000)
  }

  return (
    <div className="container-toy py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-8">Have a question? We'd love to hear from you.</p>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact Info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-500">0300-1234567</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-500">support@toyshop.pk</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-gray-500">Karachi, Pakistan</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Hours</p>
                  <p className="text-sm text-gray-500">Mon-Sat: 9AM - 8PM</p>
                  <p className="text-sm text-gray-500">Sunday: 10AM - 6PM</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-3 font-medium">Follow Us</p>
              <div className="flex gap-3">
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100">
                  <Globe className="h-5 w-5" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100">
                  <Camera className="h-5 w-5" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100">
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100">
                  <Play className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="card-toy space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-toy">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-toy w-full"
                    required
                  />
                </div>
                <div>
                  <label className="label-toy">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-toy w-full"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label-toy">Subject</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="input-toy w-full"
                  required
                />
              </div>
              <div>
                <label className="label-toy">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-toy w-full"
                  rows={5}
                  required
                />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4 inline" />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-10 card-toy overflow-hidden">
          <div className="flex h-64 items-center justify-center bg-gray-100 text-gray-400">
            <div className="text-center">
              <MapPin className="mx-auto h-10 w-10" />
              <p className="mt-2 text-sm">Interactive map coming soon</p>
              <p className="text-xs">Karachi, Pakistan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
