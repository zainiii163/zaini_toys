import { useState, useMemo } from 'react'
import { Package, TrendingDown, ArrowRight } from 'lucide-react'
import { useGetProductsQuery } from '../app/services/product'
import type { Product } from '../lib/types'

interface Props {
  currentProduct: Product
}

export default function ProductBundles({ currentProduct }: Props) {
  const { data: productsData } = useGetProductsQuery({ limit: 50 })
  const [selected, setSelected] = useState<string[]>([currentProduct._id])

  const products = (productsData?.data || []).filter(
    (p) => p.category?._id === currentProduct.category?._id && p._id !== currentProduct._id
  )

  const selectedProducts = useMemo(
    () => [currentProduct, ...products.filter((p) => selected.includes(p._id))],
    [currentProduct, products, selected]
  )

  const bundleTotal = selectedProducts.reduce((s, p) => s + (p.salePrice ?? p.price), 0)
  const bundleDiscount = Math.round(bundleTotal * 0.15)
  const bundlePrice = bundleTotal - bundleDiscount

  const toggleProduct = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  if (products.length === 0) return null

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center gap-2 mb-2">
        <Package className="h-5 w-5 text-purple-600" />
        <h2 className="font-display text-2xl font-bold">Buy Together & Save 15%</h2>
      </div>
      <p className="mb-6 text-sm text-gray-500">Add up to 2 more items from the same category to your bundle and save!</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 4).map((p) => {
          const isSelected = selected.includes(p._id)
          return (
            <button
              key={p._id}
              onClick={() => toggleProduct(p._id)}
              className={`relative rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
                isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {isSelected && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
              <img src={p.images?.[0]?.url} alt={p.name} className="h-20 w-20 rounded-lg object-cover" />
              <p className="mt-3 font-medium text-sm">{p.name}</p>
              <p className="text-sm font-bold text-gray-900">Rs. {p.salePrice ?? p.price}</p>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="mt-6 rounded-xl border-2 border-purple-200 bg-purple-50 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-purple-800">Your Bundle ({selected.length + 1} items)</p>
              <p className="text-sm text-purple-600">Includes: {selectedProducts.map((p) => p.name).join(', ')}</p>
            </div>
            <div className="text-right">
              {bundleDiscount > 0 && (
                <p className="text-sm text-green-600 line-through">Rs. {bundleTotal.toLocaleString()}</p>
              )}
              <p className="text-2xl font-bold text-purple-700">
                <TrendingDown className="mr-1 inline h-5 w-5" /> Rs. {bundlePrice.toLocaleString()}
              </p>
              <p className="text-xs text-green-600">You save Rs. {bundleDiscount}</p>
            </div>
            <button className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700">
              Add Bundle to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
