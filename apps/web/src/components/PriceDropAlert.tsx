import { useState } from 'react'
import { Bell, BellOff, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppSelector } from '../hooks/typed'

interface Props {
  productId: string
  productName: string
  currentPrice: number
}

const PRICE_WATCH_KEY = 'price_watchlist'

function getWatchlist(): { productId: string; productName: string; targetPrice: number; currentPrice: number; addedAt: string }[] {
  try {
    const data = localStorage.getItem(PRICE_WATCH_KEY)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function saveWatchlist(items: { productId: string; productName: string; targetPrice: number; currentPrice: number; addedAt: string }[]) {
  localStorage.setItem(PRICE_WATCH_KEY, JSON.stringify(items))
}

export default function PriceDropAlert({ productId, productName, currentPrice }: Props) {
  const auth = useAppSelector((s) => s.auth)
  const [showForm, setShowForm] = useState(false)
  const [targetPrice, setTargetPrice] = useState('')
  const watchlist = getWatchlist()
  const isWatching = watchlist.some((w) => w.productId === productId)

  const onToggleWatch = () => {
    if (!auth.isAuthenticated) {
      toast.error('Please login to set price alerts')
      return
    }
    if (isWatching) {
      const updated = watchlist.filter((w) => w.productId !== productId)
      saveWatchlist(updated)
      toast.success('Price alert removed')
      return
    }
    setShowForm(true)
  }

  const onSetAlert = () => {
    const price = Number(targetPrice)
    if (!price || price <= 0) {
      toast.error('Enter a valid target price')
      return
    }
    if (price >= currentPrice) {
      toast.error('Target price must be lower than current price')
      return
    }
    const updated = [...watchlist.filter((w) => w.productId !== productId), {
      productId,
      productName,
      targetPrice: price,
      currentPrice,
      addedAt: new Date().toISOString(),
    }]
    saveWatchlist(updated)
    setShowForm(false)
    setTargetPrice('')
    toast.success(`We'll notify you when price drops to Rs. ${price.toLocaleString()}`)
  }

  return (
    <div>
      <button
        onClick={onToggleWatch}
        className={`flex items-center gap-1 text-sm ${isWatching ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600'}`}
      >
        {isWatching ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        {isWatching ? 'Remove Alert' : 'Price Drop Alert'}
      </button>

      {showForm && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-2 text-sm font-medium text-amber-800">Set target price for {productName}</p>
          <p className="mb-2 text-xs text-amber-600">Current price: Rs. {currentPrice.toLocaleString()}</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Rs.</span>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full rounded-lg border border-amber-300 py-1.5 pl-10 pr-3 text-sm"
                placeholder="Target price"
              />
            </div>
            <button onClick={onSetAlert} className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700">
              <Check className="h-4 w-4" />
            </button>
          </div>
          <button onClick={() => setShowForm(false)} className="mt-2 text-xs text-amber-700 hover:underline">Cancel</button>
        </div>
      )}
    </div>
  )
}
