import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, Plus } from 'lucide-react'
import {
  useGetWishlistsQuery,
  useCreateWishlistMutation,
  useRemoveWishlistItemMutation,
  useDeleteWishlistMutation,
  useMoveAllToCartMutation,
} from '../app/services/wishlist'
import { useAddToCartMutation } from '../app/services/cart'
import { formatPrice } from '../lib/utils'

export default function WishlistPage() {
  const { data: wishlistsData } = useGetWishlistsQuery()
  const [createWishlist] = useCreateWishlistMutation()
  const [removeWishlistItem] = useRemoveWishlistItemMutation()
  const [deleteWishlist] = useDeleteWishlistMutation()
  const [moveAllToCart] = useMoveAllToCartMutation()
  const [addToCart] = useAddToCartMutation()

  const [newName, setNewName] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const wishlists = wishlistsData?.data || []

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    await createWishlist({ name: newName.trim() }).unwrap()
    setNewName('')
    setShowCreate(false)
  }

  return (
    <div className="container-toy py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">My Wishlist</h1>
          <p className="text-gray-500">Save your favorite toys for later</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-secondary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Wishlist
        </button>
      </div>

      {showCreate && (
        <form onSubmit={onCreate} className="card-toy mb-6 p-4 flex gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="input-toy flex-1"
            placeholder="Wishlist name (e.g., Birthday Gifts)"
          />
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      {wishlists.length === 0 && !showCreate ? (
        <div className="card-toy py-20 text-center">
          <Heart className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 font-display text-xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-gray-500">Browse our toys and save your favorites.</p>
          <Link to="/shop" className="btn-primary mt-6 inline-block">Browse Toys</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {wishlists.map((wl) => (
            <div key={wl._id} className="card-toy overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{wl.name}</span>
                  <span className="text-sm text-gray-500">{wl.products?.length || 0} items</span>
                  {wl.isPublic && <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Public</span>}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => moveAllToCart(wl._id)} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                    <ShoppingCart className="h-4 w-4" /> Move all to cart
                  </button>
                  <button onClick={() => deleteWishlist(wl._id)} className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>

              {wl.products && wl.products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 lg:grid-cols-4">
                  {wl.products.map((item) => (
                    <div key={item._id} className="card-toy overflow-hidden flex flex-col">
                      <Link to={`/product/${item.product?.slug || ''}`}>
                        <img src={item.product?.images?.[0]?.url} alt={item.product?.name} className="aspect-square w-full object-cover" />
                      </Link>
                      <div className="flex flex-1 flex-col p-3">
                        <Link to={`/product/${item.product?.slug || ''}`} className="line-clamp-2 text-sm font-medium hover:text-blue-600">
                          {item.product?.name}
                        </Link>
                        <p className="mt-1 font-bold text-gray-900">
                          {formatPrice(item.product?.salePrice ?? item.product?.price ?? item.priceWhenAdded)}
                        </p>
                        <div className="mt-auto pt-3 flex items-center gap-2">
                          <button
                            onClick={() => item.product?._id && addToCart({ product: item.product._id, quantity: 1 }).unwrap()}
                            className="btn-primary flex-1 inline-flex items-center justify-center gap-1 text-xs py-2"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" /> Add
                          </button>
                          <button
                            onClick={() => removeWishlistItem({ wishlistId: wl._id, itemId: item._id })}
                            className="text-gray-400 hover:text-red-600"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-gray-500">No items in this wishlist yet.</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}