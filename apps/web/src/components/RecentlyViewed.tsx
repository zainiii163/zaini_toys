import { useState } from 'react'
import { Clock, Trash2, X } from 'lucide-react'
import { getRecentlyViewed, removeFromRecentlyViewed, clearRecentlyViewed } from '../lib/recentlyViewed'
import ProductCard from './ProductCard'
import type { Product } from '../lib/types'

export default function RecentlyViewed() {
  const [items, setItems] = useState<Product[]>(getRecentlyViewed())
  const [showAll, setShowAll] = useState(false)

  if (items.length === 0) return null

  const visible = showAll ? items : items.slice(0, 5)

  const onRemove = (id: string) => {
    removeFromRecentlyViewed(id)
    setItems(getRecentlyViewed())
  }

  return (
    <section className="container-toy py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" /> Recently Viewed
        </h2>
        <div className="flex items-center gap-3">
          {items.length > 5 && (
            <button onClick={() => setShowAll(!showAll)} className="text-sm text-blue-600 hover:underline">
              {showAll ? 'Show less' : `Show all (${items.length})`}
            </button>
          )}
          <button onClick={() => { clearRecentlyViewed(); setItems([]) }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {visible.map((item) => (
          <div key={item._id} className="relative group">
            <button
              onClick={() => onRemove(item._id)}
              className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              title="Remove"
            >
              <X className="h-3 w-3 text-gray-500" />
            </button>
            <ProductCard product={item} />
          </div>
        ))}
      </div>
    </section>
  )
}
