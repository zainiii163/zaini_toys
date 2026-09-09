import { Link } from 'react-router-dom'
import { ChevronRight, Truck, ShieldCheck, CreditCard, Gift, Baby, Blocks, Puzzle, Rocket, Star, Gamepad2 } from 'lucide-react'
import { useGetBannersQuery, useGetFlashSaleQuery } from '../app/services/banner'
import {
  useGetFeaturedProductsQuery,
  useGetNewArrivalsQuery,
  useGetBestSellersQuery,
} from '../app/services/product'
import { useGetCategoryTreeQuery } from '../app/services/category'
import { useGetBrandsQuery } from '../app/services/brand'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import VideoSection from '../components/VideoSection'
import AdBanner from '../components/AdBanner'
import TestimonialSection from '../components/TestimonialSection'
import NewsletterSection from '../components/NewsletterSection'

const AGE_SECTIONS = [
  { label: '0–12 Months', icon: Baby, ageMin: 0, ageMax: 1, color: 'bg-pink-50 text-pink-600', emoji: '👶' },
  { label: '1–3 Years', icon: Blocks, ageMin: 1, ageMax: 3, color: 'bg-purple-50 text-purple-600', emoji: '🧒' },
  { label: '3–6 Years', icon: Puzzle, ageMin: 3, ageMax: 6, color: 'bg-blue-50 text-blue-600', emoji: '🎨' },
  { label: '6–9 Years', icon: Rocket, ageMin: 6, ageMax: 9, color: 'bg-teal-50 text-teal-600', emoji: '🚀' },
  { label: '9–12 Years', icon: Star, ageMin: 9, ageMax: 12, color: 'bg-amber-50 text-amber-600', emoji: '⭐' },
  { label: '12+ Years', icon: Gamepad2, ageMin: 12, ageMax: 99, color: 'bg-red-50 text-red-600', emoji: '🎮' },
]

export default function HomePage() {
  const { data: bannersData } = useGetBannersQuery({ position: 'hero' })
  const { data: flashSaleData } = useGetFlashSaleQuery()
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedProductsQuery()
  const { data: newArrivalsData, isLoading: newLoading } = useGetNewArrivalsQuery()
  const { data: bestSellersData, isLoading: bestLoading } = useGetBestSellersQuery()
  const { data: categoriesData } = useGetCategoryTreeQuery()
  const { data: brandsData } = useGetBrandsQuery()

  const banners = bannersData?.success ? bannersData.data : []
  const flashItems = flashSaleData?.success ? flashSaleData.data?.products ?? [] : []
  const categories = categoriesData?.success ? categoriesData.data?.slice(0, 8) ?? [] : []
  const featuredProducts = featuredData?.success ? featuredData.data : []
  const newArrivals = newArrivalsData?.success ? newArrivalsData.data : []
  const bestSellers = bestSellersData?.success ? bestSellersData.data : []
  const brands = brandsData?.success ? brandsData.data ?? [] : []

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
      <section className="container-toy grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Truck, title: 'Free Delivery', desc: 'Orders over Rs. 3,000', color: 'text-blue-600' },
          { icon: ShieldCheck, title: '100% Authentic', desc: 'Certified safe toys', color: 'text-emerald-600' },
          { icon: CreditCard, title: 'Secure Payment', desc: 'COD & online cards', color: 'text-amber-500' },
          { icon: Gift, title: '7-Day Returns', desc: 'Easy return policy', color: 'text-pink-500' },
        ].map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="card-toy flex items-center gap-3 p-4">
            <Icon className={`h-8 w-8 ${color}`} />
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Shop by Age */}
      <section className="container-toy py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Shop by Age</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {AGE_SECTIONS.map((ag) => (
            <Link
              key={ag.label}
              to={`/shop?ageMin=${ag.ageMin}&ageMax=${ag.ageMax}`}
              className={`card-toy flex flex-col items-center p-4 text-center transition-all hover:scale-105 hover:shadow-md ${ag.color}`}
            >
              <span className="text-3xl">{ag.emoji}</span>
              <p className="mt-2 text-xs font-semibold sm:text-sm">{ag.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      {flashSale && flashItems.length > 0 && (
        <section className="container-toy py-4">
          <div className="card-toy overflow-hidden border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-red-600">⚡ Flash Sale</h2>
              <Link to="/shop?onSale=true" className="text-sm font-medium text-red-600 hover:underline">View all</Link>
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

      {/* Ad Banner */}
      <AdBanner
        title="Summer Toy Sale"
        subtitle="Up to 40% off on selected outdoor and water toys. Limited time offer!"
        buttonText="Shop the Sale"
        buttonLink="/shop?onSale=true"
        imageUrl="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&h=400&fit=crop"
      />

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

      {/* Brands */}
      {brands.length > 0 && (
        <section className="bg-gray-50 py-8">
          <div className="container-toy">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">Popular Brands</h2>
              <Link to="/shop" className="text-sm font-medium text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {brands.slice(0, 6).map((brand) => (
                <Link
                  key={brand._id}
                  to={`/shop?brand=${brand.slug}`}
                  className="card-toy flex flex-col items-center p-4 text-center transition-shadow hover:shadow-md"
                >
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="h-12 w-12 rounded-full object-contain" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-400">
                      {brand.name[0]}
                    </div>
                  )}
                  <p className="mt-2 text-xs font-medium text-gray-700">{brand.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Educational Toys CTA */}
      <section className="container-toy py-8">
        <div className="card-toy overflow-hidden bg-gradient-to-r from-teal-500 to-blue-600 p-8 text-white">
          <div className="flex flex-col items-center text-center">
            <span className="text-4xl">🧠</span>
            <h2 className="mt-3 font-display text-2xl font-bold">Educational Toys</h2>
            <p className="mt-2 max-w-md text-blue-100">Toys that develop STEM skills, creativity, problem solving, and motor skills. Perfect for learning through play.</p>
            <Link to="/shop?category=educational" className="btn-primary mt-4 bg-white !text-blue-700 hover:bg-gray-100">
              Explore Educational Toys
            </Link>
          </div>
        </div>
      </section>

      {/* Videos */}
      <VideoSection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  )
}
