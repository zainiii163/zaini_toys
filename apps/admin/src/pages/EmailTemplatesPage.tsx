import { useState } from 'react'
import { Save, Send, Mail, Edit3, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const EMAIL_TEMPLATES = [
  { id: 'welcome', name: 'Welcome Email', subject: 'Welcome to Toy Shop Pakistan!', active: true },
  { id: 'order_confirm', name: 'Order Confirmation', subject: 'Your order has been placed!', active: true },
  { id: 'order_shipped', name: 'Order Shipped', subject: 'Your order is on the way!', active: true },
  { id: 'order_delivered', name: 'Order Delivered', subject: 'Your order has arrived!', active: true },
  { id: 'return_request', name: 'Return Request', subject: 'Return Request Received', active: true },
  { id: 'discount', name: 'Discount Offer', subject: 'Special discount just for you!', active: false },
]

export default function EmailTemplatesPage() {
  const [templates] = useState(EMAIL_TEMPLATES)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const current = templates.find((t) => t.id === editingId)

  const onEdit = (t: typeof EMAIL_TEMPLATES[0]) => {
    setEditingId(t.id)
    setSubject(t.subject)
    setBody(`<h1>${t.name}</h1><p>Email body content goes here.</p>`)
  }

  const onSave = () => {
    toast.success(`Template "${current?.name}" saved!`)
    setEditingId(null)
  }

  const onTest = (t: typeof EMAIL_TEMPLATES[0]) => {
    toast.success(`Test email sent to admin@example.com`)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Create Template
        </button>
      </div>

      <div className="grid gap-4">
        {templates.map((t) => (
          <div key={t.id} className={`stat-card p-4 ${editingId === t.id ? 'border-2 border-blue-300' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-xs text-gray-500">{t.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(t)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs hover:bg-gray-200">
                  <Edit3 className="mr-1 h-3 w-3" /> Edit
                </button>
                <button onClick={() => onTest(t)} className="rounded-lg bg-green-100 px-3 py-1.5 text-xs hover:bg-green-200">
                  <Send className="mr-1 h-3 w-3" /> Test
                </button>
                {editingId === t.id && (
                  <>
                    <div className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs text-blue-700">
                      {t.active ? '✓ Active' : 'Inactive'}
                    </div>
                  </>
                )}
              </div>
            </div>

            {editingId === t.id && current && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Subject</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="input-toy w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Body (HTML)</label>
                  <textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} className="input-toy w-full font-mono text-sm" />
                </div>
                <div className="flex gap-2">
                  <button onClick={onSave} className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Save className="h-4 w-4" /> Save Template
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
