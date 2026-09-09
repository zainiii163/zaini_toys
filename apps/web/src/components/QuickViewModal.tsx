import { useState, useCallback } from 'react'
import { X, ShoppingCart, Heart, Star, Minus, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppSelector } from '../hooks/typed'
import { useAddToCartMutation } from '../app/services/cart'

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  salePrice?: number
  images: { url: string; isPrimary?: boolean }[]
  brand?: { name: string }
  averageRating?: number
  totalReviews?: number
  availableStock: number
  shortDescription?: string
}

interface Props {
  product: Product | null
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: Props) {
  const [qty, setQty] = useState(1)
  const auth = useAppSelector((s) => s.auth)
  const [addToCart, { isLoading }] = useAddToCartMutation()

  const handleAddToCart = useCallback(async () => {
    if (!product) return
    if (!auth.isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }
    try {
      await addToCart({ product: product._id, quantity: qty }).unwrap()
      toast.success('Added to cart!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to add to cart')
    }
  }, [product, qty, auth.isAuthenticated, addToCart, onClose])

  if (!product) return null

  const image = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url || ''
  const price = product.salePrice ?? product.price
  const original = product.salePrice ? product.price : null
  const discount = original ? Math.round(((original - price) / original) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 hover:bg-white">
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            {image ? (
              <img src={image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">No image</div>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-medium text-blue-600">{product.brand?.name || 'Generic'}</p>
            <h2 className="mt-1 font-display text-xl font-bold text-gray-900">{product.name}</h2>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{product.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="text-xs text-gray-400">({product.totalReviews || 0})</span>
              </div>
              {discount > 0 && (
                <span className="rounded bg-red-50 px-1.5 py-0.5 text-xs font-bold text-red-600">-{discount}%</span>
              )}
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">Rs. {price.toLocaleString()}</span>
              {original && <span className="text-sm text-gray-400 line-through">Rs. {original.toLocaleString()}</span>}
            </div>

            {product.shortDescription && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">{product.shortDescription}</p>
            )}

            <div className="mt-2 text-sm">
              {product.availableStock > 0 ? (
                <span className="text-green-600">In Stock ({product.availableStock} available)</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>

            <div className="mt-auto flex items-center gap-3 pt-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} className="p-2 text-gray-500 hover:bg-gray-50">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.availableStock, qty + 1))} disabled={qty >= product.availableStock} className="p-2 text-gray-500 hover:bg-gray-50">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button onClick={handleAddToCart} disabled={product.availableStock === 0 || isLoading} className="btn-primary flex-1 text-sm">
                <ShoppingCart className="mr-1.5 h-4 w-4" />
                {isLoading ? 'Adding...' : product.availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            <Link to={`/product/${product.slug}`} onClick={onClose} className="mt-3 text-center text-sm text-blue-600 hover:underline">
              View full details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
