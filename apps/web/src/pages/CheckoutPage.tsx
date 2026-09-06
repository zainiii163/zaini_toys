import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useGetCartQuery } from '../app/services/cart'
import { useGetAddressesQuery } from '../app/services/user'
import { useCreateOrderMutation } from '../app/services/order'
import { useAppSelector } from '../hooks/typed'

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive the order', icon: '💵' },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Pay with Visa, Mastercard, UnionPay', icon: '💳' },
  { id: 'jazzcash', label: 'JazzCash', desc: 'Mobile wallet', icon: '📱' },
  { id: 'easypaisa', label: 'Easypaisa', desc: 'Mobile wallet', icon: '📱' },
  { id: 'raast', label: 'Raast', desc: 'Instant bank transfer', icon: '🏦' },
]

const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard Delivery', desc: '3-5 business days', price: 200, freeOver: 3000 },
  { id: 'express', label: 'Express Delivery', desc: '1-2 business days', price: 500, freeOver: 0 },
  { id: 'same_day', label: 'Same Day', desc: 'Same day (Karachi/Lahore)', price: 800, freeOver: 0 },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const auth = useAppSelector((s) => s.auth)
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'same_day'>('standard')
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    area: '',
    postalCode: '',
    isDefault: false,
  })
  const { data: cartData } = useGetCartQuery()
  const { data: addressesData } = useGetAddressesQuery()
  const [createOrder] = useCreateOrderMutation()

  const cart = cartData?.data
  const items = cart?.items || []
  const addresses = addressesData?.data || []

  if (!auth.isAuthenticated) {
    return (
      <div className="container-toy py-12 text-center">
        <p className="text-6xl mb-4">🔐</p>
        <h2 className="font-display text-2xl font-semibold mb-2">Please login to checkout</h2>
        <Link to="/login" className="btn-primary mt-4 inline-block" state={{ from: '/checkout' }}>
          Login / Register
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return <Link to="/shop" className="btn-primary">Your cart is empty. Continue shopping</Link>
  }

  const subtotal = cart?.totalAmount || 0
  const discount = cart?.couponDiscount || 0
  const shipping = shippingMethod === 'standard' && subtotal >= 3000 ? 0 : SHIPPING_METHODS.find((s) => s.id === shippingMethod)?.price || 0
  const total = subtotal + shipping - discount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAddressId && !newAddress.fullName) return toast.error('Please select or add an address')

    try {
      const order = await createOrder({
        shippingAddress: (selectedAddressId ? addresses.find((a: any) => a._id === selectedAddressId) : newAddress) as any,
        shippingMethod: shippingMethod as 'standard' | 'express' | 'same_day',
        paymentMethod: paymentMethod as 'cod' | 'card' | 'jazzcash' | 'easypaisa' | 'raast',
        couponCode: undefined,
        loyaltyPointsToRedeem: 0,
        customerNotes: '',
      }).unwrap()
      if (paymentMethod === 'cod') {
        navigate(`/order-success/${order.data.orderNumber}`)
      } else {
        // Non-COD: go to order success (payment gateway integration pending)
        navigate(`/order-success/${order.data.orderNumber}`)
      }
    } catch (err: any) {
      toast.error(err?.data?.error || 'Order failed. Please try again.')
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1: return <StepShipping addresses={addresses} />
      case 2: return <StepPayment />
      case 3: return <StepReview />
      default: return <StepShipping addresses={addresses} />
    }
  }

  function StepShipping({ addresses }: any) {
    return (
      <div className="space-y-6">
        <h3 className="font-semibold text-lg">Shipping Address</h3>

        {addresses.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Select an existing address</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {addresses.map((addr: any) => (
                <label
                  key={addr._id}
                  className={`relative cursor-pointer rounded-xl border-2 p-4 transition-colors ${
                    selectedAddressId === addr._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {addr.label[0]}
                    </div>
                    <div>
                      <p className="font-medium">{addr.fullName}</p>
                      <p className="text-sm text-gray-600">{addr.address}, {addr.area}, {addr.city}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border-2 border-dashed border-gray-300 p-4">
          <p className="text-sm text-gray-500 mb-3">Or add a new address</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={newAddress.fullName}
              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
              placeholder="Full Name"
              className="input-toy"
            />
            <input
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              placeholder="Phone"
              className="input-toy"
            />
            <input
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              placeholder="Street Address"
              className="input-toy sm:col-span-2"
            />
            <input
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              placeholder="City"
              className="input-toy"
            />
            <input
              value={newAddress.area}
              onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
              placeholder="Area / Neighborhood"
              className="input-toy"
            />
            <input
              value={newAddress.postalCode}
              onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
              placeholder="Postal Code"
              className="input-toy"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Shipping Method</h3>
          <div className="space-y-3">
            {SHIPPING_METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-colors ${
                  shippingMethod === m.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    value={m.id}
                    checked={shippingMethod === m.id}
                    onChange={() => setShippingMethod(m.id as any)}
                    className="sr-only"
                  />
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    shippingMethod === m.id ? 'border-blue-600' : 'border-gray-300'
                  }`}>
                    {shippingMethod === m.id && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{m.label}</p>
                    <p className="text-sm text-gray-500">{m.desc}</p>
                  </div>
                </div>
                <span className="font-semibold text-sm">
                  {m.freeOver > 0 && subtotal >= m.freeOver ? 'Free' : `Rs. ${m.price.toLocaleString()}`}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={() => setStep(2)} className="btn-primary w-full">Continue to Payment</button>
      </div>
    )
  }

  function StepPayment() {
    return (
      <div className="space-y-6">
        <h3 className="font-semibold text-lg">Payment Method</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.id}
              className={`relative cursor-pointer rounded-xl border-2 p-4 transition-colors ${
                paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={() => setPaymentMethod(method.id)}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <p className="font-medium">{method.label}</p>
                  <p className="text-sm text-gray-500">{method.desc}</p>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-between">
          <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
          <button onClick={() => setStep(3)} className="btn-primary">Continue to Review</button>
        </div>
      </div>
    )
  }

  function StepReview() {
    return (
      <div className="space-y-6">
        <h3 className="font-semibold text-lg">Review Order</h3>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="font-medium mb-3">Items</h4>
          <ul className="space-y-2">
            {items.slice(0, 3).map((item: any) => (
              <li key={item._id} className="flex justify-between text-sm">
                <span>{item.product?.name} × {item.quantity}</span>
                <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
            {items.length > 3 && <li className="text-sm text-gray-500">+{items.length - 3} more items</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="font-medium mb-3">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-Rs. {discount.toLocaleString()}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}</span></div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="font-medium mb-3">Shipping Method</h4>
          <p className="text-sm text-gray-600">{SHIPPING_METHODS.find((s) => s.id === shippingMethod)?.label}</p>
        </div>

        <div className="flex justify-between">
          <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
          <button onClick={handleSubmit} className="btn-primary" disabled={!selectedAddressId && !newAddress.fullName}>
            Place Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-toy py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Checkout</h1>
        <div className="mt-4 flex items-center gap-2">
          {[
            { num: 1, label: 'Shipping' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Review' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s.num}
              </div>
              {i < 2 && <div className={`w-16 h-0.5 mx-2 ${step > i + 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}
      </form>
    </div>
  )
}