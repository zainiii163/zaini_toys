import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, Share2, Minus, Plus, ChevronRight, ZoomIn, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetProductBySlugQuery, useGetRelatedProductsQuery } from '../app/services/product'
import { useGetProductReviewsQuery, useGetReviewSummaryQuery } from '../app/services/review'
import { useAddToCartMutation } from '../app/services/cart'
import { useAddToWishlistMutation, useCreateWishlistMutation, useGetWishlistsQuery } from '../app/services/wishlist'
import { useAppSelector } from '../hooks/typed'
import ProductCard from '../components/ProductCard'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [galleryIdx, setGalleryIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'shipping'>('details')
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null)
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
  const images = product.images || []
  const mainImg = images[galleryIdx]?.url || ''
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

  const lowStock = product.availableStock > 0 && product.availableStock <= 5

  return (
    <div className="container-toy py-8">
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
            className="relative aspect-square rounded-2xl border border-gray-200 bg-white overflow-hidden cursor-crosshair"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
            }}
            onMouseLeave={() => setZoomPos(null)}
          >
            <img
              src={mainImg}
              alt={product.name}
              className="h-full w-full object-cover"
              style={zoomPos ? { transform: 'scale(1.5)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
            />
            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white">-{discount}%</span>
            )}
            {product.isNewArrival && (
              <span className="absolute right-3 top-3 rounded-lg bg-teal-500 px-2.5 py-1 text-xs font-bold text-white">NEW</span>
            )}
            {!zoomPos && images.length > 1 && (
              <div className="absolute bottom-3 right-3 rounded-lg bg-black/50 px-2 py-1 text-xs text-white flex items-center gap-1">
                <ZoomIn className="h-3 w-3" /> Hover to zoom
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  className={`flex-shrink-0 h-20 w-20 rounded-lg border-2 overflow-hidden transition-all ${
                    i === galleryIdx ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img.url} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
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
            <Link to={`/compare`} className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600">
              Compare
            </Link>
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

      {/* Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="flex gap-6" role="tablist">
            {['details', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && summaryData?.data?.total && (
                  <span className="ml-1 text-sm text-gray-400">({summaryData.data.total})</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-6">
          {activeTab === 'details' && (
            <div className="prose max-w-none">
              <h3 className="font-semibold">Product Description</h3>
              <p className="whitespace-pre-wrap mt-2">{product.description}</p>
              {product.material?.length > 0 && (
                <>
                  <h3 className="mt-6 font-semibold">Materials</h3>
                  <ul className="list-disc list-inside mt-2">{product.material.map((m) => <li key={m}>{m}</li>)}</ul>
                </>
              )}
              {product.educationalBenefits?.length > 0 && (
                <>
                  <h3 className="mt-6 font-semibold">Educational Benefits</h3>
                  <ul className="list-disc list-inside mt-2">{product.educationalBenefits.map((b) => <li key={b}>{b}</li>)}</ul>
                </>
              )}
              {product.safetyWarnings?.length > 0 && (
                <>
                  <h3 className="mt-6 font-semibold">Safety Warnings</h3>
                  <ul className="list-disc list-inside mt-2">{product.safetyWarnings.map((w) => <li key={w}>{w}</li>)}</ul>
                </>
              )}
              {product.dimensions && (
                <>
                  <h3 className="mt-6 font-semibold">Dimensions</h3>
                  <p>L: {product.dimensions.length}cm × W: {product.dimensions.width}cm × H: {product.dimensions.height}cm</p>
                </>
              )}
              {product.weight && (
                <p>Weight: {product.weight}g</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {summaryData?.data && (
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">{summaryData.data.average?.toFixed(1) || '0.0'}</span>
                      <div>
                        <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                        <span className="text-gray-500 text-sm">({summaryData.data.total || 0} reviews)</span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-8 text-right text-sm">{star}★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded">
                            <div
                              className="h-full bg-amber-400 rounded"
                              style={{ width: `${(summaryData.data.counts as any)?.[star] ? ((summaryData.data.counts as any)[star] / summaryData.data.total) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {reviewsData?.data?.slice(0, 3).map((r: any) => (
                      <div key={r._id} className="card-toy p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{r.user?.name || 'Anonymous'}</span>
                          <span className="text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-1 flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`h-4 w-4 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <p className="mt-2 text-sm">{r.comment}</p>
                      </div>
                    ))}
                    <Link to={`/product/${slug}#reviews`} className="text-sm text-blue-600 hover:underline">View all reviews</Link>
                  </div>
                </div>
              )}
              {reviewsData?.data?.length === 0 && <p className="text-gray-500">No reviews yet. Be the first to review!</p>}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 text-gray-700 text-sm">
              <p><strong>Standard Shipping:</strong> 3-5 business days (Free over Rs. 3,000)</p>
              <p><strong>Express Shipping:</strong> 1-2 business days (Rs. 500)</p>
              <p><strong>Same Day Delivery:</strong> Available in Karachi & Lahore (Rs. 800)</p>
              <p><strong>Returns:</strong> 7-day return policy. Items must be unused in original packaging with tags attached.</p>
              <p><strong>Refunds:</strong> Processed within 5-7 business days after receiving the return.</p>
            </div>
          )}
        </div>
      </div>

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
