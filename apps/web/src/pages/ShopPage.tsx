import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
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
]

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
    rating: params.get('rating') ? Number(params.get('rating')) : undefined,
    sort: params.get('sort') || '',
    featured: params.get('featured') || undefined,
    newArrival: params.get('newArrival') || undefined,
    bestSeller: params.get('bestSeller') || undefined,
    onSale: params.get('onSale') || undefined,
  }

  const { data, isLoading } = useGetProductsQuery(query)
  const { data: categoriesData } = useGetCategoryTreeQuery()
  const { data: brandsData } = useGetBrandsQuery()

  const products = data?.success ? data.data : []
  const pagination = data?.pagination
  const categories = categoriesData?.success ? categoriesData.data ?? [] : []
  const brands = brandsData?.success ? brandsData.data ?? [] : []

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.set('page', '1')
    setParams(next, { replace: true })
  }

  useEffect(() => {
    setSearchInput(params.get('search') || '')
  }, [params])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam('search', searchInput)
  }

  return (
    <div className="container-toy py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {query.search ? `Results for "${query.search}"` : categories.find((c) => c.slug === query.category)?.name || 'All Toys'}
          </h1>
          <p className="text-sm text-gray-500">{pagination?.total ?? 0} products</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-secondary md:hidden">
            <SlidersHorizontal className="mr-1 h-4 w-4" /> Filters
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

      <form onSubmit={onSearch} className="mb-6 flex max-w-lg gap-2">
        <div className="flex flex-1 items-center rounded-lg border border-gray-300 bg-white px-3">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
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

            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="mb-3 text-sm font-semibold">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`block w-full text-left text-sm ${!query.category ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateParam('category', cat.slug)}
                    className={`block w-full text-left text-sm ${query.category === cat.slug ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4">
              <h3 className="mb-3 text-sm font-semibold">Brands</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <button
                  onClick={() => updateParam('brand', '')}
                  className={`block w-full text-left text-sm ${!query.brand ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  All Brands
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand._id}
                    onClick={() => updateParam('brand', brand.slug)}
                    className={`block w-full text-left text-sm ${query.brand === brand.slug ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4">
              <h3 className="mb-3 text-sm font-semibold">Price (Rs.)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  defaultValue={query.minPrice || ''}
                  onBlur={(e) => updateParam('minPrice', e.target.value)}
                  className="input-toy"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  defaultValue={query.maxPrice || ''}
                  onBlur={(e) => updateParam('maxPrice', e.target.value)}
                  className="input-toy"
                />
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4">
              <h3 className="mb-3 text-sm font-semibold">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2].map((r) => (
                  <button
                    key={r}
                    onClick={() => updateParam('rating', query.rating === r ? '' : String(r))}
                    className={`block w-full text-left text-sm ${query.rating === r ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    {r}+ Stars
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
              className="btn-secondary mt-4 w-full"
            >
              Clear Filters
            </button>
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
