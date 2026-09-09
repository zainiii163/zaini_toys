import { Link } from 'react-router-dom'
import { ChevronRight, Truck, ShieldCheck, CreditCard, Gift } from 'lucide-react'
import { useGetBannersQuery, useGetFlashSaleQuery } from '../app/services/banner'
import {
  useGetFeaturedProductsQuery,
  useGetNewArrivalsQuery,
  useGetBestSellersQuery,
} from '../app/services/product'
import { useGetCategoryTreeQuery } from '../app/services/category'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import VideoSection from '../components/VideoSection'
import AdBanner from '../components/AdBanner'
import TestimonialSection from '../components/TestimonialSection'
import NewsletterSection from '../components/NewsletterSection'

export default function HomePage() {
  const { data: bannersData } = useGetBannersQuery({ position: 'hero' })
  const { data: flashSaleData } = useGetFlashSaleQuery()
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedProductsQuery()
  const { data: newArrivalsData, isLoading: newLoading } = useGetNewArrivalsQuery()
  const { data: bestSellersData, isLoading: bestLoading } = useGetBestSellersQuery()
  const { data: categoriesData } = useGetCategoryTreeQuery()

  const banners = bannersData?.success ? bannersData.data : []
  const flashItems = flashSaleData?.success ? flashSaleData.data?.products ?? [] : []
  const categories = categoriesData?.success ? categoriesData.data?.slice(0, 8) ?? [] : []
  const featuredProducts = featuredData?.success ? featuredData.data : []
  const newArrivals = newArrivalsData?.success ? newArrivalsData.data : []
  const bestSellers = bestSellersData?.success ? bestSellersData.data : []

  const hero = banners.find((b) => b.position === 'hero')
  const flashSale = flashSaleData?.success ? flashSaleData.data : null

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative">
        {hero ? (
          <div className="relative h-[420px] w-full overflow-hidden bg-blue-600">
            <img src={hero.image.url} alt={hero.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="container-toy relative flex h-full flex-col justify-center">
              <h1 className="max-w-xl font-display text-4xl font-bold text-white sm:text-5xl">{hero.title}</h1>
              {hero.subtitle && <p className="mt-3 max-w-lg text-lg text-gray-200">{hero.subtitle}</p>}
              <Link to="/shop" className="btn-primary mt-6 w-fit bg-white !text-blue-700 hover:bg-gray-100">
                Shop Now <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 py-16">
            <div className="container-toy">
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
                Fun, Safe Toys for Every Kid
              </h1>
              <p className="mt-3 max-w-lg text-lg text-blue-100">
                Educational, exciting, and age-appropriate toys delivered across Pakistan.
              </p>
              <Link to="/shop" className="btn-primary mt-6 w-fit bg-white !text-blue-700 hover:bg-gray-100">
                Shop Now <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Trust badges */}
      <section className="container-toy -mt-0 grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-toy flex items-center gap-3 p-4">
          <Truck className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-sm font-semibold">Fast Delivery</p>
            <p className="text-xs text-gray-500">Across Pakistan</p>
          </div>
        </div>
        <div className="card-toy flex items-center gap-3 p-4">
          <ShieldCheck className="h-8 w-8 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold">Certified Safe</p>
            <p className="text-xs text-gray-500">Quality tested toys</p>
          </div>
        </div>
        <div className="card-toy flex items-center gap-3 p-4">
          <CreditCard className="h-8 w-8 text-amber-500" />
          <div>
            <p className="text-sm font-semibold">Secure Payment</p>
            <p className="text-xs text-gray-500">COD &amp; cards</p>
          </div>
        </div>
        <div className="card-toy flex items-center gap-3 p-4">
          <Gift className="h-8 w-8 text-pink-500" />
          <div>
            <p className="text-sm font-semibold">Easy Returns</p>
            <p className="text-xs text-gray-500">7-day returns</p>
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      {flashSale && flashItems.length > 0 && (
        <section className="container-toy py-4">
          <div className="card-toy overflow-hidden border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-red-600">⚡ Flash Sale</h2>
              <Link to="/shop?onSale=true" className="text-sm font-medium text-red-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {flashItems.slice(0, 5).map((item: any) => {
                const p = item.product
                if (!p) return null
                return (
                  <Link key={p._id} to={`/product/${p.slug}`} className="card-toy group overflow-hidden">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img src={p.images?.[0]?.url} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                      <p className="text-sm font-bold text-red-600">Rs. {item.salePrice?.toLocaleString()}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="container-toy py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Shop by Category</h2>
          <Link to="/shop" className="text-sm font-medium text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="card-toy group flex flex-col items-center p-4 text-center transition-shadow hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  '🧸'
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-gray-800 group-hover:text-blue-600">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-toy py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Featured Toys</h2>
          <Link to="/shop?featured=true" className="text-sm font-medium text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featuredLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : featuredProducts.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-white py-8">
        <div className="container-toy">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">New Arrivals</h2>
            <Link to="/shop?newArrival=true" className="text-sm font-medium text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {newLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container-toy py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Best Sellers</h2>
          <Link to="/shop?bestSeller=true" className="text-sm font-medium text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {bestLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : bestSellers.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner
        title="Summer Toy Sale"
        subtitle="Up to 40% off on selected outdoor and water toys. Limited time offer!"
        buttonText="Shop the Sale"
        buttonLink="/shop?onSale=true"
        imageUrl="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&h=400&fit=crop"
      />

      {/* Videos */}
      <VideoSection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  )
}
