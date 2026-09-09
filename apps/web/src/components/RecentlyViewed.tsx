import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Trash2 } from 'lucide-react'
import { getRecentlyViewed, clearRecentlyViewed } from '../lib/recentlyViewed'
import ProductCard from './ProductCard'

export default function RecentlyViewed() {
  const [items, setItems] = useState(getRecentlyViewed)
  const [showAll, setShowAll] = useState(false)

  if (items.length === 0) return null

  const visible = showAll ? items : items.slice(0, 5)

  return (
    <section className="container-toy py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" /> Recently Viewed
        </h2>
        <div className="flex items-center gap-3">
          {items.length > 5 && (
            <button onClick={() => setShowAll(!showAll)} className="text-sm font-medium text-blue-600 hover:underline">
              {showAll ? 'Show less' : `View all (${items.length})`}
            </button>
          )}
          <button
            onClick={() => { clearRecentlyViewed(); setItems([]) }}
            className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {visible.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  )
}
