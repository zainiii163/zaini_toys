import type { Product } from '../app/services/product'

const RECENTLY_VIEWED_KEY = 'recently_viewed'
const MAX_ITEMS = 20

export function getRecentlyViewed(): Product[] {
  try {
    const data = localStorage.getItem(RECENTLY_VIEWED_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addToRecentlyViewed(product: Product): void {
  try {
    const items = getRecentlyViewed().filter((p) => p._id !== product._id)
    items.unshift(product)
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)))
  } catch {}
}

export function clearRecentlyViewed(): void {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY)
  } catch {}
}
