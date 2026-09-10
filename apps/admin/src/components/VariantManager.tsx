import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'

interface Variant {
  id: string
  name: string
  value: string
  sku?: string
  price?: number
  stock?: number
  isActive: boolean
}

interface Props {
  variants: Variant[]
  onChange: (variants: Variant[]) => void
}

export default function VariantManager({ variants, onChange }: Props) {
  const addVariant = () => {
    const newVariant: Variant = {
      id: `variant-${Date.now()}`,
      name: '',
      value: '',
      sku: '',
      price: 0,
      stock: 0,
      isActive: true,
    }
    onChange([...variants, newVariant])
  }

  const updateVariant = (id: string, field: string, value: string | number | boolean) => {
    onChange(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    )
  }

  const removeVariant = (id: string) => {
    onChange(variants.filter((v) => v.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Variants</h3>
        <button
          onClick={addVariant}
          className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-3 w-3" /> Add Variant
        </button>
      </div>

      {variants.length === 0 && (
        <p className="text-sm text-gray-500">No variants. Add size, color, or other variants.</p>
      )}

      <div className="space-y-2">
        {variants.map((variant, i) => (
          <div key={variant.id} className="flex items-center gap-2 rounded-lg border border-gray-200 p-3">
            <GripVertical className="h-4 w-4 flex-shrink-0 text-gray-400 cursor-grab" />
            <input
              type="text"
              value={variant.name}
              onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
              placeholder="Name (e.g., Color)"
              className="input-toy w-24 text-xs"
            />
            <input
              type="text"
              value={variant.value}
              onChange={(e) => updateVariant(variant.id, 'value', e.target.value)}
              placeholder="Value (e.g., Red)"
              className="input-toy w-28 text-xs"
            />
            <input
              type="text"
              value={variant.sku || ''}
              onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
              placeholder="SKU"
              className="input-toy w-24 text-xs"
            />
            <input
              type="number"
              value={variant.stock || 0}
              onChange={(e) => updateVariant(variant.id, 'stock', Number(e.target.value))}
              placeholder="Stock"
              className="input-toy w-20 text-xs"
            />
            <button
              onClick={() => updateVariant(variant.id, 'isActive', !variant.isActive)}
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                variant.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {variant.isActive ? 'Active' : 'Inactive'}
            </button>
            <button
              onClick={() => removeVariant(variant.id)}
              className="rounded p-1 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
