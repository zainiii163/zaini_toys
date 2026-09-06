import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days. Same-day delivery is available in Karachi and Lahore for orders placed before 2PM.',
  },
  {
    q: 'Is COD (Cash on Delivery) available?',
    a: 'Yes! We accept Cash on Delivery across Pakistan. You can also pay online via credit/debit card, JazzCash, Easypaisa, or Raast.',
  },
  {
    q: 'What is the return policy?',
    a: 'You can return products within 7 days of delivery if they are unused, in original packaging, with tags attached. Refunds are processed within 5-7 business days after we receive the returned item.',
  },
  {
    q: 'How do I track my order?',
    a: 'After placing your order, you\'ll receive an order confirmation with a tracking number. You can track your order from your Account > My Orders page, or use the tracking link sent to your email.',
  },
  {
    q: 'Are the toys safe for children?',
    a: 'Absolutely! All our products meet international safety standards (ASTM, EN71, CE). We only stock products from trusted brands that prioritize child safety.',
  },
  {
    q: 'How do loyalty points work?',
    a: 'You earn loyalty points on every purchase (1 point per Rs. 100 spent). Points can be redeemed at checkout. Your loyalty tier (Bronze, Silver, Gold, VIP) is based on your total spending and unlocks additional benefits.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'You can cancel your order before it\'s shipped. Go to Account > My Orders and click "Cancel" on the order. For changes, please contact our support team immediately.',
  },
  {
    q: 'Do you offer gift wrapping?',
    a: 'Currently, gift wrapping is not available. However, we\'re working on adding this feature soon! In the meantime, you can add a gift message during checkout.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept: Cash on Delivery (COD), Credit/Debit Cards (Visa, Mastercard, UnionPay), JazzCash, Easypaisa, and Raast (instant bank transfer).',
  },
  {
    q: 'How do I apply a coupon?',
    a: 'Add items to your cart, then enter your coupon code in the "Apply Coupon" section on the cart page. The discount will be applied to your order total.',
  },
]

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="container-toy py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-500 mb-8">Find answers to common questions about ordering, shipping, and more.</p>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="font-medium pr-4">{faq.q}</span>
                {openIdx === i ? (
                  <ChevronUp className="h-5 w-5 flex-shrink-0 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400" />
                )}
              </button>
              {openIdx === i && (
                <div className="border-t border-gray-100 px-5 pb-5 pt-3 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <a href="/contact" className="btn-primary inline-block">Contact Us</a>
        </div>
      </div>
    </div>
  )
}
