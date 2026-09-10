import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Plus } from 'lucide-react'
import { useGetProductsQuery } from '../app/services/product'
import type { Product } from '../lib/types'

const MAX_COMPARE = 4

export default function ComparePage() {
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const { data: productsData } = useGetProductsQuery({ limit: 50, ...(search && { search }) })

  const allProducts: Product[] = productsData?.data || []
  const compareProducts = allProducts.filter((p) => compareIds.includes(p._id))

  const addProduct = (id: string) => {
    if (!compareIds.includes(id) && compareIds.length < MAX_COMPARE) {
      setCompareIds([...compareIds, id])
    }
  }

  const removeProduct = (id: string) => {
    setCompareIds(compareIds.filter((i) => i !== id))
  }

  const specs = [
    { label: 'Price', key: 'price' },
    { label: 'Sale Price', key: 'salePrice' },
    { label: 'Age Range', key: 'ageRange' },
    { label: 'Brand', key: 'brand' },
    { label: 'Category', key: 'category' },
    { label: 'Material', key: 'material' },
    { label: 'Weight', key: 'weight' },
    { label: 'Stock', key: 'availableStock' },
    { label: 'Rating', key: 'averageRating' },
    { label: 'Reviews', key: 'totalReviews' },
    { label: 'Educational Benefits', key: 'educationalBenefits' },
  ]

  return (
    <div className="container-toy py-8">
      <h1 className="font-display text-2xl font-bold mb-6">Compare Products</h1>
      <p className="text-sm text-gray-500 mb-6">Select up to {MAX_COMPARE} products to compare side by side.</p>

      {/* Search to add products */}
      {compareIds.length < MAX_COMPARE && (
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products to compare..."
            className="w-full max-w-md rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          {search && (
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {allProducts
                .filter((p) => !compareIds.includes(p._id))
                .slice(0, 8)
                .map((p) => (
                  <button
                    key={p._id}
                    onClick={() => { addProduct(p._id); setSearch('') }}
                    className="card-toy flex items-center gap-2 p-2 text-left text-sm hover:bg-gray-50"
                  >
                    <img src={p.images?.[0]?.url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span className="line-clamp-2 text-xs font-medium">{p.name}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {compareProducts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-4xl">⚖️</p>
          <p className="mt-4 text-gray-500">Search and add products to compare.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 p-3 text-left text-sm font-medium text-gray-500 w-40">Feature</th>
                {compareProducts.map((p) => (
                  <th key={p._id} className="p-3 text-center">
                    <div className="relative">
                      <button onClick={() => removeProduct(p._id)} className="absolute -top-1 -right-1 rounded-full bg-red-100 p-0.5 text-red-500 hover:bg-red-200">
                        <X className="h-3 w-3" />
                      </button>
                      <Link to={`/product/${p.slug}`}>
                        <img src={p.images?.[0]?.url} alt={p.name} className="mx-auto h-24 w-24 rounded-xl object-cover" />
                        <p className="mt-2 text-sm font-medium line-clamp-2 hover:text-blue-600">{p.name}</p>
                      </Link>
                    </div>
                  </th>
                ))}
                {compareIds.length < MAX_COMPARE && (
                  <th className="p-3 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 mx-auto text-gray-400">
                      <Plus className="h-6 w-6" />
                    </div>
                    <p className="mt-2 text-xs text-gray-400">Add product</p>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {specs.map((spec) => (
                <tr key={spec.key} className="border-t border-gray-100">
                  <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium text-gray-700">{spec.label}</td>
                  {compareProducts.map((p) => {
                    let value: any = (p as any)[spec.key]
                    if (spec.key === 'brand' && typeof value === 'object') value = value?.name
                    if (spec.key === 'category' && typeof value === 'object') value = value?.name
                    if (spec.key === 'ageRange' && typeof value === 'object') value = value ? `${value.min || 0}–${value.max || '+'}yr` : '-'
                    if (spec.key === 'material' && Array.isArray(value)) value = value.join(', ')
                    if (spec.key === 'educationalBenefits' && Array.isArray(value)) value = value.join(', ')
                    if (spec.key === 'price' || spec.key === 'salePrice') value = value ? `Rs. ${value.toLocaleString()}` : '-'
                    if (spec.key === 'averageRating') value = value ? `${value.toFixed(1)} ⭐` : '-'
                    if (spec.key === 'weight') value = value ? `${value}g` : '-'
                    if (value === null || value === undefined || value === '') value = '-'
                    return (
                      <td key={p._id} className="p-3 text-center text-sm text-gray-700">{value}</td>
                    )
                  })}
                  {compareIds.length < MAX_COMPARE && <td className="p-3 text-center text-sm text-gray-300">-</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
