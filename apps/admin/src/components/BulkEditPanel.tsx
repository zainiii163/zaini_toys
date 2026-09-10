import { useState } from 'react'
import { Package, Loader2, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useUpdateProductMutation } from '../app/services/product'

interface Props {
  selectedIds: string[]
  onComplete: () => void
}

export default function BulkEditPanel({ selectedIds, onComplete }: Props) {
  const [updateProduct] = useUpdateProductMutation()
  const [price, setPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [stock, setStock] = useState('')
  const [updating, setUpdating] = useState(false)

  const onApply = async () => {
    setUpdating(true)
    let success = 0
    let errors = 0

    const body: Record<string, any> = {}
    if (price) body.price = Number(price)
    if (salePrice) body.salePrice = Number(salePrice) || undefined
    if (stock) body.availableStock = Number(stock)

    for (const id of selectedIds) {
      try {
        await updateProduct({ id, body }).unwrap()
        success++
      } catch {
        errors++
      }
    }

    setUpdating(false)
    if (success > 0) toast.success(`${success} products updated`)
    if (errors > 0) toast.error(`${errors} products failed`)
    onComplete()
  }

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Package className="h-5 w-5 text-blue-600" />
        <span className="font-semibold text-sm text-blue-800">Bulk Edit ({selectedIds.length} selected)</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-700">Price (Rs.)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input-toy w-full" placeholder="Leave blank to skip" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-700">Sale Price (Rs.)</label>
          <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="input-toy w-full" placeholder="Leave blank to skip" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-700">Stock</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="input-toy w-full" placeholder="Leave blank to skip" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={onApply} disabled={updating || (!price && !salePrice && !stock)} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          {updating ? 'Updating...' : 'Apply to All'}
        </button>
        <button onClick={onComplete} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
          <XCircle className="mr-1 h-4 w-4" /> Cancel
        </button>
      </div>
    </div>
  )
}
