import { useState } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

type Category = 'All' | 'Orders' | 'Shipping' | 'Returns' | 'Payment' | 'Account'

const categories: Category[] = ['All', 'Orders', 'Shipping', 'Returns', 'Payment', 'Account']

interface FaqItem {
  category: Category
  q: string
  a: string
}

const FAQS: FaqItem[] = [
  {
    category: 'Orders',
    q: 'How do I place an order?',
    a: 'Simply browse our shop, add items to your cart, and proceed to checkout. You can create an account or check out as a guest. Follow the steps to enter your shipping details and choose a payment method.',
  },
  {
    category: 'Orders',
    q: 'Can I change or cancel my order?',
    a: "You can cancel your order before it's shipped. Go to Account > My Orders and click \"Cancel\" on the order. For changes, please contact our support team immediately.",
  },
  {
    category: 'Orders',
    q: 'How do I apply a coupon?',
    a: 'Add items to your cart, then enter your coupon code in the "Apply Coupon" section on the cart page. The discount will be applied to your order total.',
  },
  {
    category: 'Shipping',
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days. Same-day delivery is available in Karachi and Lahore for orders placed before 2PM.',
  },
  {
    category: 'Shipping',
    q: 'How do I track my order?',
    a: "After placing your order, you'll receive an order confirmation with a tracking number. You can track your order from your Account > My Orders page, or use the tracking link sent to your email.",
  },
  {
    category: 'Shipping',
    q: 'Do you offer free shipping?',
    a: 'Yes! We offer free standard shipping on all orders above Rs. 3,000. For orders below that, a flat shipping fee of Rs. 150 applies.',
  },
  {
    category: 'Returns',
    q: 'What is the return policy?',
    a: 'You can return products within 7 days of delivery if they are unused, in original packaging, with tags attached. Refunds are processed within 5-7 business days after we receive the returned item.',
  },
  {
    category: 'Returns',
    q: 'How do I initiate a return?',
    a: 'Go to Account > My Orders, select the order, and click "Request Return". Choose your reason and our team will get back to you with return instructions within 24 hours.',
  },
  {
    category: 'Payment',
    q: 'What payment methods do you accept?',
    a: 'We accept: Cash on Delivery (COD), Credit/Debit Cards (Visa, Mastercard, UnionPay), JazzCash, Easypaisa, and Raast (instant bank transfer).',
  },
  {
    category: 'Payment',
    q: 'Is COD (Cash on Delivery) available?',
    a: 'Yes! We accept Cash on Delivery across Pakistan. You can also pay online via credit/debit card, JazzCash, Easypaisa, or Raast.',
  },
  {
    category: 'Account',
    q: 'How do loyalty points work?',
    a: 'You earn loyalty points on every purchase (1 point per Rs. 100 spent). Points can be redeemed at checkout. Your loyalty tier (Bronze, Silver, Gold, VIP) is based on your total spending and unlocks additional benefits.',
  },
  {
    category: 'Account',
    q: 'Are the toys safe for children?',
    a: 'Absolutely! All our products meet international safety standards (ASTM, EN71, CE). We only stock products from trusted brands that prioritize child safety.',
  },
]

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [search, setSearch] = useState('')

  const filtered = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory
    const matchesSearch =
      search === '' ||
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container-toy py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-500 mb-8">Find answers to common questions about ordering, shipping, and more.</p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-toy w-full pl-10"
          />
        </div>

        {/* Categories */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-gray-400">No questions found. Try a different search or category.</p>
          ) : (
            filtered.map((faq) => {
              const globalIdx = FAQS.indexOf(faq)
              const isOpen = openIdx === globalIdx
              return (
                <div key={globalIdx} className="card-toy overflow-hidden">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : globalIdx)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <div>
                      <span className="mr-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                        {faq.category}
                      </span>
                      <span className="font-medium">{faq.q}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-gray-600">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-500">Still have questions?</p>
          <a href="/contact" className="btn-primary inline-block">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
