import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '../lib/types'
import { useAddToCartMutation } from '../app/services/cart'
import { useAppSelector } from '../hooks/typed'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate()
  const auth = useAppSelector((s) => s.auth)
  const [addToCart] = useAddToCartMutation()

  const image = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url || ''
  const price = product.salePrice ?? product.price
  const original = product.salePrice ? product.price : null
  const discount = original ? Math.round(((original - price) / original) * 100) : 0

  const onAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!auth.isAuthenticated) {
      navigate('/login', { state: { from: `/product/${product.slug}` } })
      return
    }
    try {
      await addToCart({ product: product._id, quantity: 1 }).unwrap()
      toast.success('Added to cart!')
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to add to cart')
    }
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group card-toy relative flex flex-col overflow-hidden transition-shadow hover:shadow-md"
    >
      {discount > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
          -{discount}%
        </span>
      )}
      {product.isNewArrival && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-teal-500 px-2 py-0.5 text-xs font-bold text-white">
          New
        </span>
      )}

      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No image</div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-gray-500">{product.brand?.name || 'Generic'}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-gray-900">{product.name}</h3>

        <div className="mt-1 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs text-gray-600">{product.averageRating?.toFixed(1) || '0.0'}</span>
          <span className="text-xs text-gray-400">({product.totalReviews || 0})</span>
        </div>

        <div className="mt-2 flex items-end justify-between">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">Rs. {price.toLocaleString()}</span>
            {original && <span className="text-sm text-gray-400 line-through">{original.toLocaleString()}</span>}
          </div>
        </div>

        <button
          onClick={onAdd}
          disabled={product.availableStock === 0}
          className="btn-primary mt-3 !py-2 text-xs"
        >
          <ShoppingCart className="mr-1.5 h-4 w-4" />
          {product.availableStock === 0 ? 'Out of stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}
