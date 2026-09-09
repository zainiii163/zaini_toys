import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, Trash2, Heart, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation, useClearCartMutation, useApplyCouponMutation, useRemoveCouponMutation } from '../app/services/cart'
import { useAddToWishlistMutation, useCreateWishlistMutation, useGetWishlistsQuery } from '../app/services/wishlist'

export default function CartPage() {
  const [coupon, setCoupon] = useState('')
  const [addToWishlist, { isLoading: wishLoading }] = useAddToWishlistMutation()
  const [createWishlist] = useCreateWishlistMutation()
  const { data: wishlistsData } = useGetWishlistsQuery()
  const wishlist = wishlistsData?.data?.[0]

  const { data: cartData } = useGetCartQuery()
  const [updateQty] = useUpdateCartItemMutation()
  const [removeItem] = useRemoveFromCartMutation()
  const [clearCart] = useClearCartMutation()
  const [applyCoupon] = useApplyCouponMutation()
  const [removeCoupon] = useRemoveCouponMutation()

  const cart = cartData?.data
  const items = cart?.items || []

  if (items.length === 0) {
    return (
      <div className="container-toy py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="font-display text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any toys yet.</p>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    )
  }

  const subtotal = cart?.totalAmount || 0
  const shipping = subtotal >= 3000 ? 0 : 200
  const total = subtotal + shipping - (cart?.couponDiscount || 0)

  const onSaveForLater = async (itemId: string, productId: string) => {
    try {
      if (!wishlist) {
        const wl = await createWishlist({ name: 'My Wishlist' }).unwrap()
        await addToWishlist({ wishlistId: wl.data._id, product: productId }).unwrap()
      } else {
        await addToWishlist({ wishlistId: wishlist._id, product: productId }).unwrap()
      }
      await removeItem(itemId).unwrap()
      toast.success('Saved for later')
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to save for later')
    }
  }

  const onUpdateQty = async (itemId: string, quantity: number) => {
    try {
      await updateQty({ itemId, body: { quantity } }).unwrap()
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to update quantity')
    }
  }

  const onRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId).unwrap()
      toast.success('Item removed')
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to remove item')
    }
  }

  const onClearCart = async () => {
    try {
      await clearCart().unwrap()
      toast.success('Cart cleared')
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to clear cart')
    }
  }

  return (
    <div className="container-toy py-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="divide-y divide-gray-200">
            {items.map((item: any) => (
              <li key={item._id} className="py-4 flex gap-4">
                <Link to={`/product/${item.product?.slug || ''}`} className="relative h-24 w-24 flex-shrink-0 rounded-xl border border-gray-200 overflow-hidden">
                  <img src={item.product?.images?.[0]?.url} alt={item.product?.name} className="h-full w-full object-cover" />
                  {item.variant && <span className="absolute bottom-0 right-0 m-1 text-xs bg-white/90 px-1.5 py-0.5 rounded">{item.variant}</span>}
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product?.slug || ''}`} className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1">
                    {item.product?.name}
                  </Link>
                  {item.variantName && <p className="text-sm text-gray-500">{item.variantName}</p>}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-bold text-gray-900">Rs. {item.price.toLocaleString()}</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button onClick={() => onUpdateQty(item._id, Math.max(1, item.quantity - 1))} className="p-2 text-gray-500 hover:bg-gray-50"><Minus className="h-4 w-4" /></button>
                      <input value={item.quantity} onChange={(e) => onUpdateQty(item._id, Number(e.target.value) || 1)} className="w-12 text-center border-x border-gray-300 bg-transparent outline-none" min="1" />
                      <button onClick={() => onUpdateQty(item._id, item.quantity + 1)} className="p-2 text-gray-500 hover:bg-gray-50"><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold text-lg text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  <button onClick={() => onSaveForLater(item._id, item.product._id)} disabled={wishLoading} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
                    <Heart className="h-4 w-4" /> Save
                  </button>
                  <button onClick={() => onRemoveItem(item._id)} className="text-gray-400 hover:text-red-500 p-1">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {items.length > 1 && (
            <button onClick={onClearCart} className="mt-4 text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
              <X className="h-4 w-4" /> Clear Cart
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sticky top-24">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className="font-medium">{shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}</span>
            </div>
            {cart?.couponCode && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Coupon ({cart.couponCode})</span>
                <span className="font-medium">-Rs. {cart.couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <hr className="border-gray-200" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-4">
            <form onSubmit={async (e) => { e.preventDefault(); if (!coupon.trim()) return; try { await applyCoupon({ code: coupon }).unwrap(); toast.success('Coupon applied!'); setCoupon('') } catch (err: any) { toast.error(err?.data?.error || 'Invalid coupon code') } }}>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="input-toy flex-1"
                />
                <button type="submit" className="btn-secondary !px-3 !py-2 text-sm">Apply</button>
              </div>
            </form>
            {cart?.couponCode && (
              <button onClick={() => { removeCoupon(); toast.success('Coupon removed') }} className="mt-2 w-full text-sm text-red-600 hover:underline">
                Remove coupon
              </button>
            )}
          </div>

          <Link to="/checkout" className="btn-primary mt-6 w-full text-center">
            Proceed to Checkout
          </Link>

          <p className="mt-4 text-xs text-center text-gray-500">
            Shipping, taxes, and discounts calculated at checkout.
          </p>
        </div>
      </div>
    </div>
  )
}