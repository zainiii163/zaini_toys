import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, Share2, Minus, Plus, ChevronRight, ZoomIn } from 'lucide-react'
import { MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetProductBySlugQuery, useGetRelatedProductsQuery } from '../app/services/product'
import { useGetProductReviewsQuery, useGetReviewSummaryQuery } from '../app/services/review'
import { useAddToCartMutation } from '../app/services/cart'
import { useAddToWishlistMutation, useCreateWishlistMutation, useGetWishlistsQuery } from '../app/services/wishlist'
import { useAppSelector } from '../hooks/typed'
import ProductCard from '../components/ProductCard'
import { addToRecentlyViewed } from '../lib/recentlyViewed'
import PriceDropAlert from '../components/PriceDropAlert'
import SEO from '../components/SEO'
import AgeVerificationModal from '../components/AgeVerificationModal'
import ProductCareTab from '../components/ProductCareTab'
import ProductBundles from '../components/ProductBundles'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [galleryIdx, setGalleryIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'shipping'>('details')
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null)
  const [showAgeVerify, setShowAgeVerify] = useState(false)
  const [addToCart, { isLoading: adding }] = useAddToCartMutation()
  const [createWishlist] = useCreateWishlistMutation()
  const [addToWishlist] = useAddToWishlistMutation()
  const auth = useAppSelector((s) => s.auth)
  const { data: wishlistsData } = useGetWishlistsQuery(undefined, { skip: !auth.isAuthenticated })
  const wishlist = wishlistsData?.data?.[0]

  const { data: productData, isLoading: productLoading } = useGetProductBySlugQuery(slug || '', { skip: !slug })
  const { data: relatedData } = useGetRelatedProductsQuery(productData?.data?._id || '')
  const { data: reviewsData } = useGetProductReviewsQuery({ productId: productData?.data?._id || '', page: 1 })
  const { data: summaryData } = useGetReviewSummaryQuery(productData?.data?._id || '')

  if (productLoading) {
    return (
      <div className="container-toy py-8">
        <div className="grid gap-8 lg:grid-cols-2 animate-pulse">
          <div>
            <div className="aspect-square rounded-2xl bg-gray-200" />
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 w-20 rounded-lg bg-gray-200" />)}
            </div>
          </div>
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="mt-2 h-8 w-3/4 bg-gray-200 rounded" />
            <div className="mt-3 h-4 w-32 bg-gray-200 rounded" />
            <div className="mt-4 h-10 w-40 bg-gray-200 rounded" />
            <div className="mt-4 h-4 w-full bg-gray-200 rounded" />
            <div className="mt-2 h-4 w-2/3 bg-gray-200 rounded" />
            <div className="mt-6 h-12 w-full bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }
  if (!productData?.success || !productData.data) {
    return <div className="container-toy py-12 text-center">Product not found</div>
  }

  const product = productData.data

  if (product.ageRestriction && product.ageRestriction > 0) {
    if (!auth.isAuthenticated) {
      navigate('/login', { state: { from: `/product/${slug}` } })
      return null
    }
    if (auth.user && auth.user.age < product.ageRestriction) {
      return <AgeVerificationModal open={showAgeVerify} onAccept={() => setShowAgeVerify(false)} onDecline={() => navigate('/')} />
    }
  }

  const images = product.images || []
  const videos = (product as any).videos || []
  const allMedia = [
    ...images.map((img: any, i: number) => ({ type: 'image' as const, url: img.url, index: i })),
    ...videos.map((vid: any, i: number) => ({ type: 'video' as const, url: vid.url, index: images.length + i })),
  ]
  const mainImg = images[galleryIdx]?.url || ''
  const mainVideo = galleryIdx >= images.length ? videos[galleryIdx - images.length] : null
  const price = product.salePrice ?? product.price
  const original = product.salePrice ? product.price : null
  const discount = original ? Math.round(((original - price) / original) * 100) : 0

  const onAddCart = async () => {
    if (!auth.isAuthenticated) {
      navigate('/login', { state: { from: `/product/${slug}` } })
      return
    }
    try {
      await addToCart({ product: product._id, quantity: qty }).unwrap()
      toast.success('Added to cart!')
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to add to cart')
    }
  }

  const onAddWish = async () => {
    if (!auth.isAuthenticated) {
      navigate('/login', { state: { from: `/product/${slug}` } })
      return
    }
    try {
      if (!wishlist) {
        const wl = await createWishlist({ name: 'My Wishlist' }).unwrap()
        await addToWishlist({ wishlistId: wl.data._id, product: product._id }).unwrap()
      } else {
        await addToWishlist({ wishlistId: wishlist._id, product: product._id }).unwrap()
      }
      toast.success('Saved to wishlist!')
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to save to wishlist')
    }
  }

  const onShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied!')
    }
  }

  const onWhatsAppShare = () => {
    const url = window.location.href
    const text = `Check out ${product.name} on Toy Shop! ${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const lowStock = product.availableStock > 0 && product.availableStock <= 5

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product as any)
    }
  }, [product])

  return (
    <div className="container-toy py-8">
      <SEO
        title={product.name}
        description={product.shortDescription || product.description?.substring(0, 160)}
        image={product.images?.[0]?.url}
        type="product"
        keywords={[product.name, product.brand?.name, product.category?.name].filter(Boolean).join(', ')}
      />
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-blue-600">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/shop?category=${product.category?.slug || ''}`} className="hover:text-blue-600">{product.category?.name || 'Category'}</Link>
          </>
        )}
        {product.brand && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/shop?brand=${product.brand?.slug || ''}`} className="hover:text-blue-600">{product.brand?.name}</Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="truncate max-w-[200px] text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div
            className="relative aspect-square rounded-2xl border border-gray-200 bg-white overflow-hidden"
            onMouseMove={(e) => {
              if (mainVideo) return
              const rect = e.currentTarget.getBoundingClientRect()
              setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
            }}
            onMouseLeave={() => setZoomPos(null)}
          >
            {mainVideo ? (
              <video
                src={mainVideo.url}
                controls
                className="h-full w-full object-cover"
                poster={images[0]?.url}
              />
            ) : (
              <img
                src={mainImg}
                alt={product.name}
                className="h-full w-full object-cover cursor-crosshair"
                style={zoomPos ? { transform: 'scale(1.5)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
              />
            )}
            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white">-{discount}%</span>
            )}
            {product.isNewArrival && (
              <span className="absolute right-3 top-3 rounded-lg bg-teal-500 px-2.5 py-1 text-xs font-bold text-white">NEW</span>
            )}
            {!zoomPos && !mainVideo && images.length > 1 && (
              <div className="absolute bottom-3 right-3 rounded-lg bg-black/50 px-2 py-1 text-xs text-white flex items-center gap-1">
                <ZoomIn className="h-3 w-3" /> Hover to zoom
              </div>
            )}
          </div>
          {allMedia.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {allMedia.map((media, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(media.index)}
                  className={`relative flex-shrink-0 h-20 w-20 rounded-lg border-2 overflow-hidden transition-all ${
                    i === galleryIdx ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  {media.type === 'video' ? (
                    <>
                      <img src={images[0]?.url || ''} alt="Video" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </>
                  ) : (
                    <img src={media.url} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-medium text-blue-600">{product.brand?.name || 'Generic'}</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-gray-900">{product.name}</h1>

          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{product.averageRating?.toFixed(1) || '0.0'}</span>
              <span className="text-gray-500">({product.totalReviews || 0} reviews)</span>
            </div>
            {discount > 0 && (
              <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">{discount}% OFF</span>
            )}
            {product.isNewArrival && (
              <span className="rounded bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-600">New</span>
            )}
            {product.isBestSeller && (
              <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600">Best Seller</span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">Rs. {price.toLocaleString()}</span>
            {original && <span className="text-xl text-gray-400 line-through">Rs. {original.toLocaleString()}</span>}
            {discount > 0 && <span className="text-sm font-medium text-green-600">You save Rs. {(original! - price).toLocaleString()}</span>}
          </div>

          <p className="mt-4 text-gray-600">{product.shortDescription || product.description}</p>

          {/* SKU & Category */}
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
            {product.sku && <span>SKU: {product.sku}</span>}
            {product.category && <span>Category: {product.category?.name}</span>}
          </div>

          {/* Stock */}
          <div className="mt-4 flex items-center gap-2">
            {product.availableStock > 0 ? (
              <>
                <span className="flex items-center gap-1 text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  In Stock
                </span>
                {lowStock && (
                  <span className="text-xs text-orange-600 font-medium">Only {product.availableStock} left — order soon!</span>
                )}
              </>
            ) : (
              <span className="flex items-center gap-1 text-red-600">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Out of Stock
              </span>
            )}
          </div>

          {/* Delivery Estimate */}
          <div className="mt-3 rounded-xl bg-blue-50 p-3 text-sm">
            <div className="flex items-center gap-2 text-blue-700 font-medium">
              <Truck className="h-4 w-4" />
              {product.availableStock > 0 ? (
                <span>Estimated delivery: <strong>3-5 business days</strong> (Standard) or <strong>1-2 days</strong> (Express)</span>
              ) : (
                <span>This item is currently out of stock</span>
              )}
            </div>
          </div>

          {/* Qty & Add to Cart */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} className="p-3 text-gray-500 hover:bg-gray-50">
                <Minus className="h-5 w-5" />
              </button>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 text-center border-x border-gray-300 bg-transparent outline-none"
                min="1"
                max={product.availableStock}
              />
              <button onClick={() => setQty(Math.min(product.availableStock, qty + 1))} disabled={qty >= product.availableStock} className="p-3 text-gray-500 hover:bg-gray-50">
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <button onClick={onAddCart} disabled={product.availableStock === 0 || adding} className="btn-primary flex-1 min-w-[180px]">
              <ShoppingCart className="mr-2 h-5 w-5" />
              {adding ? 'Adding...' : product.availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Wishlist & Share & Compare */}
          <div className="mt-4 flex items-center gap-4">
            <button onClick={onAddWish} className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500">
              <Heart className="h-5 w-5" /> Save
            </button>
            <button onClick={onShare} className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
              <Share2 className="h-5 w-5" /> Share
            </button>
            <button onClick={onWhatsAppShare} className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600">
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </button>
            <Link to={`/compare`} className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600">
              Compare
            </Link>
          </div>

          {/* Price Drop Alert */}
          <div className="mt-3">
            <PriceDropAlert productId={product._id} productName={product.name} currentPrice={price} />
          </div>

          {/* Benefits */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Truck, label: 'Free Delivery', desc: 'Orders over Rs. 3,000' },
              { icon: ShieldCheck, label: '7-Day Returns', desc: 'Easy return policy' },
              { icon: Share2, label: 'Secure Payment', desc: 'COD & Online' },
              { icon: Star, label: 'Quality Guarantee', desc: 'Certified safe toys' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                <Icon className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Care & Safety Tabs */}
      <div className="mt-12">
        <ProductCareTab product={product} />
      </div>

      {/* Product Bundles */}
      <ProductBundles currentProduct={product} />

      {/* Related Products */}
      {relatedData?.data && relatedData.data.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedData.data.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
