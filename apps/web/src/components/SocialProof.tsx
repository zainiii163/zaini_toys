import { useState, useEffect, useCallback } from 'react'
import { X, ShoppingCart } from 'lucide-react'

const NAMES = ['Ahmed', 'Fatima', 'Ali', 'Sara', 'Hassan', 'Ayesha', 'Omar', 'Zainab', 'Bilal', 'Mariam']
const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']
const PRODUCTS = [
  'Wooden Building Blocks', 'Remote Control Car', 'STEM Robot Kit', 'Plush Teddy Bear',
  'Paint Set', 'Board Game', 'Train Set', 'Doll House', 'Lego City Set', 'Outdoor Tricycle',
  'Puzzle 100pc', 'Science Lab Kit', 'Action Figure', 'Art Easel', 'Musical Piano Toy',
]

interface Notification {
  id: number
  name: string
  city: string
  product: string
  time: string
}

let notifId = 0

function generateRandom(): Notification {
  return {
    id: ++notifId,
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
    product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
    time: `${Math.floor(Math.random() * 30) + 1} minutes ago`,
  }
}

export default function SocialProof() {
  const [current, setCurrent] = useState<Notification | null>(null)
  const [visible, setVisible] = useState(false)

  const show = useCallback(() => {
    const notif = generateRandom()
    setCurrent(notif)
    setVisible(true)
    setTimeout(() => setVisible(false), 5000)
  }, [])

  useEffect(() => {
    const firstTimeout = setTimeout(show, 8000)
    const interval = setInterval(show, 25000)
    return () => { clearTimeout(firstTimeout); clearInterval(interval) }
  }, [show])

  if (!current) return null

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 max-w-xs transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
          <ShoppingCart className="h-5 w-5 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900">{current.name} from {current.city}</p>
          <p className="text-xs text-gray-500 truncate">just purchased {current.product}</p>
          <p className="text-[10px] text-gray-400">{current.time}</p>
        </div>
        <button onClick={() => setVisible(false)} className="flex-shrink-0 rounded-full p-1 hover:bg-gray-100">
          <X className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </div>
    </div>
  )
}
