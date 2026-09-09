import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Star } from 'lucide-react'
import { useGetProductsQuery } from '../app/services/product'
import { useGetCategoryTreeQuery } from '../app/services/category'
import { useGetBrandsQuery } from '../app/services/brand'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'

const SORTS = [
  { value: '', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'bestseller', label: 'Best Selling' },
]

const AGE_GROUPS = [
  { label: '0–12 Months', min: 0, max: 1 },
  { label: '1–2 Years', min: 1, max: 2 },
  { label: '3–5 Years', min: 3, max: 5 },
  { label: '6–8 Years', min: 6, max: 8 },
  { label: '9–12 Years', min: 9, max: 12 },
  { label: '13+ Years', min: 13, max: 99 },
]

const PRICE_RANGES = [
  { label: 'Under Rs. 500', min: '', max: '500' },
  { label: 'Rs. 500 – 1,000', min: '500', max: '1000' },
  { label: 'Rs. 1,000 – 3,000', min: '1000', max: '3000' },
  { label: 'Rs. 3,000 – 5,000', min: '3000', max: '5000' },
  { label: 'Rs. 5,000 – 10,000', min: '5000', max: '10000' },
  { label: 'Over Rs. 10,000', min: '10000', max: '' },
]

function FilterSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-sm font-semibold">
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function ShopPage() {
  const [params, setParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(params.get('search') || '')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const query = {
    page: Number(params.get('page')) || 1,
    limit: 12,
    search: params.get('search') || undefined,
    category: params.get('category') || undefined,
    brand: params.get('brand') || undefined,
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    ageMin: params.get('ageMin') ? Number(params.get('ageMin')) : undefined,
    ageMax: params.get('ageMax') ? Number(params.get('ageMax')) : undefined,
    rating: params.get('rating') ? Number(params.get('rating')) : undefined,
    sort: params.get('sort') || '',
    featured: params.get('featured') || undefined,
    newArrival: params.get('newArrival') || undefined,
    bestSeller: params.get('bestSeller') || undefined,
    onSale: params.get('onSale') || undefined,
    availability: params.get('availability') || undefined,
  }

  const { data, isLoading } = useGetProductsQuery(query)
  const { data: categoriesData } = useGetCategoryTreeQuery()
  const { data: brandsData } = useGetBrandsQuery()

  const products = data?.success ? data.data : []
  const pagination = data?.pagination
  const categories = categoriesData?.success ? categoriesData.data ?? [] : []
  const brands = brandsData?.success ? brandsData.data ?? [] : []

  const activeFilterCount = [
    params.get('category'),
    params.get('brand'),
    params.get('minPrice'),
    params.get('maxPrice'),
    params.get('ageMin'),
    params.get('ageMax'),
    params.get('rating'),
    params.get('onSale'),
    params.get('availability'),
  ].filter(Boolean).length

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.set('page', '1')
    setParams(next, { replace: true })
  }

  const setAgeGroup = (min: number, max: number) => {
    const next = new URLSearchParams(params)
    if (params.get('ageMin') === String(min) && params.get('ageMax') === String(max)) {
      next.delete('ageMin')
      next.delete('ageMax')
    } else {
      next.set('ageMin', String(min))
      next.set('ageMax', String(max))
    }
    next.set('page', '1')
    setParams(next, { replace: true })
  }

  const setPriceRange = (min: string, max: string) => {
    const next = new URLSearchParams(params)
    if (params.get('minPrice') === min && params.get('maxPrice') === max) {
      next.delete('minPrice')
      next.delete('maxPrice')
    } else {
      if (min) next.set('minPrice', min); else next.delete('minPrice')
      if (max) next.set('maxPrice', max); else next.delete('maxPrice')
    }
    next.set('page', '1')
    setParams(next, { replace: true })
  }

  useEffect(() => {
    setSearchInput(params.get('search') || '')
  }, [params])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam('search', searchInput)
  }

  const clearAllFilters = () => {
    const next = new URLSearchParams()
    if (params.get('search')) next.set('search', params.get('search')!)
    setParams(next, { replace: true })
  }

  return (
    <div className="container-toy py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {query.search ? `Results for "${query.search}"` : categories.find((c) => c.slug === query.category)?.name || 'All Toys'}
          </h1>
          <p className="text-sm text-gray-500">{pagination?.total ?? 0} products found</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-secondary md:hidden">
            <SlidersHorizontal className="mr-1 h-4 w-4" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          <select
            value={query.sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="input-toy w-auto"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter pills */}
      {activeFilterCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {params.get('category') && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {categories.find((c) => c.slug === params.get('category'))?.name || params.get('category')}
              <button onClick={() => updateParam('category', '')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {params.get('brand') && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {brands.find((b) => b.slug === params.get('brand'))?.name || params.get('brand')}
              <button onClick={() => updateParam('brand', '')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {params.get('ageMin') && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              Age {params.get('ageMin')}–{params.get('ageMax')}
              <button onClick={() => { updateParam('ageMin', ''); updateParam('ageMax', '') }}><X className="h-3 w-3" /></button>
            </span>
          )}
          {params.get('minPrice') && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              Rs. {params.get('minPrice')}+
              <button onClick={() => updateParam('minPrice', '')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {params.get('maxPrice') && !params.get('minPrice') && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              Up to Rs. {params.get('maxPrice')}
              <button onClick={() => updateParam('maxPrice', '')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {params.get('rating') && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {params.get('rating')}+ Stars
              <button onClick={() => updateParam('rating', '')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {params.get('onSale') && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
              On Sale
              <button onClick={() => updateParam('onSale', '')}><X className="h-3 w-3" /></button>
            </span>
          )}
          <button onClick={clearAllFilters} className="text-xs text-gray-500 hover:text-red-600 underline">Clear all</button>
        </div>
      )}

      <form onSubmit={onSearch} className="mb-6 flex max-w-lg gap-2">
        <div className="flex flex-1 items-center rounded-lg border border-gray-300 bg-white px-3">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search toys, brands, categories..."
            className="w-full bg-transparent px-2 py-2 text-sm outline-none"
          />
        </div>
        <button type="submit" className="btn-primary !py-2">Search</button>
      </form>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} fixed inset-0 z-40 bg-black/40 md:static md:z-auto md:block md:w-64 md:bg-transparent`}>
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-white p-5 shadow-xl md:static md:w-auto md:px-0 md:shadow-none">
            <div className="mb-3 flex items-center justify-between md:hidden">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button>
            </div>

            {/* Categories */}
            <FilterSection title="Categories">
              <div className="space-y-2">
                <button onClick={() => updateParam('category', '')} className={`block w-full text-left text-sm ${!query.category ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>All Categories</button>
                {categories.map((cat) => (
                  <button key={cat._id} onClick={() => updateParam('category', cat.slug)} className={`block w-full text-left text-sm ${query.category === cat.slug ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>{cat.name}</button>
                ))}
              </div>
            </FilterSection>

            {/* Age Groups */}
            <div className="mt-4">
              <FilterSection title="Age Group">
                <div className="space-y-2">
                  {AGE_GROUPS.map((ag) => {
                    const isActive = Number(params.get('ageMin')) === ag.min && Number(params.get('ageMax')) === ag.max
                    return (
                      <button key={ag.label} onClick={() => setAgeGroup(ag.min, ag.max)} className={`block w-full text-left text-sm ${isActive ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>{ag.label}</button>
                    )
                  })}
                </div>
              </FilterSection>
            </div>

            {/* Price Ranges */}
            <div className="mt-4">
              <FilterSection title="Price Range">
                <div className="space-y-2">
                  {PRICE_RANGES.map((pr) => {
                    const isActive = params.get('minPrice') === pr.min && params.get('maxPrice') === pr.max
                    return (
                      <button key={pr.label} onClick={() => setPriceRange(pr.min, pr.max)} className={`block w-full text-left text-sm ${isActive ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>{pr.label}</button>
                    )
                  })}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input type="number" placeholder="Min" defaultValue={query.minPrice || ''} onBlur={(e) => updateParam('minPrice', e.target.value)} className="input-toy" />
                  <span className="text-gray-400">–</span>
                  <input type="number" placeholder="Max" defaultValue={query.maxPrice || ''} onBlur={(e) => updateParam('maxPrice', e.target.value)} className="input-toy" />
                </div>
              </FilterSection>
            </div>

            {/* Brands */}
            <div className="mt-4">
              <FilterSection title="Brands" defaultOpen={false}>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <button onClick={() => updateParam('brand', '')} className={`block w-full text-left text-sm ${!query.brand ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>All Brands</button>
                  {brands.map((brand) => (
                    <button key={brand._id} onClick={() => updateParam('brand', brand.slug)} className={`block w-full text-left text-sm ${query.brand === brand.slug ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>{brand.name}</button>
                  ))}
                </div>
              </FilterSection>
            </div>

            {/* Rating */}
            <div className="mt-4">
              <FilterSection title="Rating">
                <div className="space-y-2">
                  {[4, 3, 2].map((r) => (
                    <button key={r} onClick={() => updateParam('rating', query.rating === r ? '' : String(r))} className={`flex w-full items-center gap-2 text-sm ${query.rating === r ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < r ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span>& Up</span>
                    </button>
                  ))}
                </div>
              </FilterSection>
            </div>

            {/* Deals */}
            <div className="mt-4">
              <FilterSection title="Deals" defaultOpen={false}>
                <div className="space-y-2">
                  <button onClick={() => updateParam('onSale', query.onSale ? '' : '1')} className={`block w-full text-left text-sm ${query.onSale ? 'font-semibold text-red-600' : 'text-gray-600 hover:text-red-600'}`}>On Sale</button>
                  <button onClick={() => updateParam('newArrival', params.get('newArrival') ? '' : '1')} className={`block w-full text-left text-sm ${params.get('newArrival') ? 'font-semibold text-teal-600' : 'text-gray-600 hover:text-teal-600'}`}>New Arrivals</button>
                  <button onClick={() => updateParam('bestSeller', params.get('bestSeller') ? '' : '1')} className={`block w-full text-left text-sm ${params.get('bestSeller') ? 'font-semibold text-amber-600' : 'text-gray-600 hover:text-amber-600'}`}>Best Sellers</button>
                  <button onClick={() => updateParam('featured', params.get('featured') ? '' : '1')} className={`block w-full text-left text-sm ${params.get('featured') ? 'font-semibold text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>Featured</button>
                </div>
              </FilterSection>
            </div>

            {/* Availability */}
            <div className="mt-4">
              <FilterSection title="Availability" defaultOpen={false}>
                <div className="space-y-2">
                  <button onClick={() => updateParam('availability', params.get('availability') === 'in_stock' ? '' : 'in_stock')} className={`block w-full text-left text-sm ${params.get('availability') === 'in_stock' ? 'font-semibold text-green-600' : 'text-gray-600 hover:text-green-600'}`}>In Stock Only</button>
                </div>
              </FilterSection>
            </div>

            <button onClick={clearAllFilters} className="btn-secondary mt-4 w-full">Clear All Filters</button>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-4xl">🔍</p>
              <h3 className="mt-3 text-lg font-semibold">No products found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
              <button onClick={clearAllFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParam('page', String(i + 1))}
                  className={`h-9 w-9 rounded-lg text-sm font-medium ${query.page === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
