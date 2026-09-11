import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Truck, ShieldCheck, CreditCard, Gift } from 'lucide-react'
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
import RecentlyViewed from '../components/RecentlyViewed'
import SEO from '../components/SEO'
import Reveal from '../components/Reveal'
import { BUDGET_RANGES, LITTLE_ONES, SEO_TEXT, TRUST_ITEMS } from '../config/site'
import type { LittleOne } from '../config/site'

const budgetUrl = (b: { max: number }) => `/shop?maxPrice=${b.max}`
const littleOneUrl = (l: LittleOne) =>
  l.gender ? `/shop?gender=${l.gender}` : `/shop?ageMin=${l.ageMin}`

const BUDGET_TILES = [
  'from-orange-50 to-amber-50',
  'from-teal-50 to-cyan-50',
  'from-pink-50 to-rose-50',
  'from-violet-50 to-purple-50',
]

const TRUST_BADGES = [
  { icon: Truck, title: 'Free Delivery', desc: 'Orders over Rs. 3,000', color: 'text-primary' },
  { icon: ShieldCheck, title: '100% Authentic', desc: 'Certified safe toys', color: 'text-emerald-600' },
  { icon: CreditCard, title: 'Secure Payment', desc: 'COD & online cards', color: 'text-nectarine' },
  { icon: Gift, title: '7-Day Returns', desc: 'Easy return policy', color: 'text-pink-500' },
]

const HERO_FLOATS = ['🧸', '🎈', '🎨', '🪀', '🐉', '🪁', '✨', '🚀']

const MARQUEE_ITEMS = [...TRUST_ITEMS.map((i) => `${i.emoji} ${i.text}`), '🎉 New arrivals every week!', '🎁 Free gift wrapping over Rs. 5,000', '⭐ Rated 4.8/5 by 12,000+ parents']

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
  const allCategories = categoriesData?.success ? categoriesData.data ?? [] : []
  const categories = allCategories.slice(0, 8)
  const featuredProducts = featuredData?.success ? featuredData.data : []
  const newArrivals = newArrivalsData?.success ? newArrivalsData.data : []
  const bestSellers = bestSellersData?.success ? bestSellersData.data : []
  const brands = brandsData?.success ? brandsData.data ?? [] : []

  const heroBanners = banners.filter((b) => b.position === 'hero')
  const flashSale = flashSaleData?.success ? flashSaleData.data : null

  const [heroIdx, setHeroIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (heroBanners.length <= 1) return
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % heroBanners.length), 6000)
    return () => clearInterval(t)
  }, [heroBanners.length])

  const activeHero = heroBanners[heroIdx % Math.max(heroBanners.length, 1)]
  const heroTitle = activeHero?.title ?? 'Fun, Safe Toys for Every Kid'
  const heroSubtitle =
    activeHero?.subtitle ?? 'Educational, exciting, and age-appropriate toys delivered across Pakistan.'
  const heroLink = activeHero?.link ?? '/shop'

  const scrollCategories = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <div>
      <SEO
        title="Fun, Safe Toys for Every Kid"
        description="Pakistan's #1 online toy store. Educational, exciting, and age-appropriate toys with free delivery over Rs. 3,000."
        keywords="toys Pakistan, online toys, educational toys, kids toys, baby toys, LEGO, remote control cars"
      />

      {/* Hero carousel */}
      <section className="relative overflow-hidden bg-primary">
        <div className="relative h-[380px] w-full sm:h-[440px]">
          {heroBanners.map((b, i) => (
            <div
              key={b._id}
              className={`absolute inset-0 transition-opacity duration-700 ${i === heroIdx ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            >
              <img src={b.image.url} alt={b.title} className="h-full w-full object-cover" />
            </div>
          ))}
          {heroBanners.length > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-blue-900/40 to-transparent" />
          )}

          {/* Floating decorations */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            {HERO_FLOATS.map((emoji, i) => (
              <span
                key={i}
                className="absolute select-none text-3xl opacity-60 sm:opacity-40"
                style={{
                  left: `${10 + (i * 11) % 80}%`,
                  top: `${12 + (i * 17) % 70}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${4.5 + i * 0.5}s`,
                }}
                aria-hidden
              >
                <span className={i % 2 === 0 ? 'animate-floaty inline-block' : 'animate-floaty-slow inline-block'}>{emoji}</span>
              </span>
            ))}
            <span className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-teal-400/25 to-nectarine/20 blur-3xl animate-spin-slow" />
          </div>

          <div key={heroIdx} className="container-toy relative flex h-full flex-col justify-center">
            <h1 className="max-w-xl font-display text-4xl font-bold text-white sm:text-5xl rise" style={{ animationDelay: '0ms' }}>{heroTitle}</h1>
            <p className="mt-3 max-w-lg text-lg text-blue-100 rise" style={{ animationDelay: '90ms' }}>{heroSubtitle}</p>
            <Link to={heroLink} className="btn-primary btn-shine mt-6 w-fit bg-white !text-primary-dark hover:bg-gray-100 rise" style={{ animationDelay: '180ms' }}>
              Shop Now <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          {heroBanners.length > 1 && (
            <>
              <button
                onClick={() => setHeroIdx((heroIdx - 1 + heroBanners.length) % heroBanners.length)}
                className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-700 shadow hover:bg-white transition-all hover:scale-110 sm:block"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setHeroIdx((heroIdx + 1) % heroBanners.length)}
                className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-700 shadow hover:bg-white transition-all hover:scale-110 sm:block"
                aria-label="Next banner"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
                {heroBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIdx(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${i === heroIdx ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                    aria-label={`Go to banner ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Marquee trust strip */}
      <div className="border-y border-gray-200 bg-white py-2 overflow-hidden">
        <div className="marquee-track text-xs font-medium text-gray-600 gap-8">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 whitespace-nowrap px-4">
              {item}
              <span className="text-primary/30">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <section className="container-toy grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_BADGES.map(({ icon: Icon, title, desc, color }, i) => (
          <Reveal key={title} delay={i * 80}>
            <div className="card-toy flex h-full items-center gap-3 p-4">
              <span className="animate-pulse-soft flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Icon className={`h-7 w-7 ${color}`} />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Top Selling Categories */}
      <section className="container-toy py-8">
        <Reveal>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Top Selling Categories</h2>
            <Link to="/shop" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat, idx) => (
            <Reveal key={cat._id} delay={idx * 60}>
              <Link
                to={`/shop?category=${cat.slug}`}
                className="card-toy group relative flex flex-col items-center p-4 text-center"
              >
                <span
                  className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${idx % 2 === 0 ? 'bg-red-500' : 'bg-primary'}`}
                >
                  {idx % 2 === 0 ? 'HOT' : 'NEW'}
                </span>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl group-hover:scale-110 transition-transform">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <span>{cat.icon || '🧸'}</span>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-gray-800 group-hover:text-primary">{cat.name}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Shop for Little Ones */}
      <section className="container-toy py-8">
        <Reveal><h2 className="mb-4 font-display text-2xl font-semibold">Shop for Little Ones</h2></Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {LITTLE_ONES.map((l, i) => (
            <Reveal key={l.label} delay={i * 80}>
              <Link
                to={littleOneUrl(l)}
                className={`card-toy group flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${l.tile} p-8 text-center`}
              >
                <span className="text-5xl transition-transform group-hover:scale-110">{l.emoji}</span>
                <p className="font-display text-lg font-semibold text-gray-800">{l.label}</p>
                <span className="text-xs font-medium text-gray-500 group-hover:text-primary">Shop now →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Shop by Budget */}
      <section className="container-toy py-8">
        <Reveal><h2 className="mb-4 font-display text-2xl font-semibold">Shop by Budget</h2></Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BUDGET_RANGES.map((b, idx) => (
            <Reveal key={b.label} delay={idx * 70}>
              <Link
                to={budgetUrl(b)}
                className={`card-toy group flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-br p-5 ${BUDGET_TILES[idx % BUDGET_TILES.length]}`}
              >
                <div>
                  <p className="font-display text-lg font-semibold text-gray-800">{b.label}</p>
                  <span className="text-xs text-gray-500 group-hover:text-orange-600">Explore →</span>
                </div>
                <span className="text-3xl transition-transform group-hover:scale-110">{b.emoji}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      {flashSale && flashItems.length > 0 && (
        <section className="container-toy py-4">
          <Reveal variant="zoom">
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
                        <img src={p.images?.[0]?.url} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
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
          </Reveal>
        </section>
      )}

      {/* Popular Categories - horizontal scroll */}
      {allCategories.length > 0 && (
        <section className="container-toy py-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Our Popular Categories</h2>
            <div className="flex items-center gap-2">
              <Link to="/shop" className="mr-2 text-sm font-medium text-primary hover:underline">View all</Link>
              <button onClick={() => scrollCategories(-1)} className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-600 hover:bg-gray-50" aria-label="Scroll left">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => scrollCategories(1)} className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-600 hover:bg-gray-50" aria-label="Scroll right">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2">
            {allCategories.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className="flex w-32 shrink-0 flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <span>{cat.icon || '🧸'}</span>
                  )}
                </div>
                <p className="line-clamp-2 text-xs font-medium text-gray-700">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container-toy py-8">
        <Reveal>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Featured Toys</h2>
            <Link to="/shop?featured=true" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featuredLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : featuredProducts.map((p, i) => (
                <Reveal key={p._id} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
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
          <Reveal>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">New Arrivals</h2>
              <Link to="/shop?newArrival=true" className="text-sm font-medium text-primary hover:underline">View all</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {newLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : newArrivals.map((p, i) => (
                  <Reveal key={p._id} delay={i * 60}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container-toy py-8">
        <Reveal>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Best Sellers</h2>
            <Link to="/shop?bestSeller=true" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {bestLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : bestSellers.map((p, i) => (
                <Reveal key={p._id} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
        </div>
      </section>

      {/* Brands */}
      {brands.length > 0 && (
        <section className="bg-gray-50 py-8">
          <div className="container-toy">
            <Reveal>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">Popular Brands</h2>
                <Link to="/shop" className="text-sm font-medium text-primary hover:underline">View all</Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {brands.slice(0, 6).map((brand, i) => (
                <Reveal key={brand._id} delay={i * 60}>
                  <Link
                    to={`/shop?brand=${brand.slug}`}
                    className="card-toy flex flex-col items-center p-4 text-center"
                  >
                    {brand.logo ? (
                      <img src={brand.logo.url} alt={brand.name} className="h-12 w-12 rounded-full object-contain transition-transform group-hover:scale-110" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-400">
                        {brand.name[0]}
                      </div>
                    )}
                    <p className="mt-2 text-xs font-medium text-gray-700">{brand.name}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Educational Toys CTA */}
      <section className="container-toy py-8">
        <Reveal variant="zoom">
          <div className="card-toy overflow-hidden bg-gradient-to-r from-teal-500 to-primary p-8 text-white animate-gradient-pan">
            <div className="flex flex-col items-center text-center">
              <span className="text-5xl animate-pulse-soft">🧠</span>
              <h2 className="mt-3 font-display text-2xl font-bold">Educational Toys</h2>
              <p className="mt-2 max-w-md text-blue-100">Toys that develop STEM skills, creativity, problem solving, and motor skills. Perfect for learning through play.</p>
              <Link to="/shop?category=educational" className="btn-primary btn-shine mt-4 bg-white !text-primary-dark hover:bg-gray-100">
                Explore Educational Toys
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SEO text */}
      <section className="bg-white py-10">
        <Reveal>
          <div className="container-toy mx-auto max-w-3xl text-center text-sm leading-relaxed text-gray-600">
            <h2 className="font-display text-xl font-semibold text-gray-900">{SEO_TEXT.title}</h2>
            {SEO_TEXT.paragraphs.map((p, i) => (
              <p key={i} className="mt-3">{p}</p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Videos */}
      <VideoSection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Recently Viewed */}
      <RecentlyViewed />
    </div>
  )
}