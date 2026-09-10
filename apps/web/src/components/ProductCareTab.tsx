import { useState } from 'react'
import { ChevronDown, ChevronUp, Wrench, Shield, AlertTriangle, BookOpen } from 'lucide-react'
import type { Product } from '../lib/types'

interface Props {
  product: Product
}

type CareTab = 'care' | 'safety' | 'materials' | 'dimensions'

const TABS: { key: CareTab; label: string; icon: typeof Wrench }[] = [
  { key: 'care', label: 'Care Instructions', icon: Wrench },
  { key: 'safety', label: 'Safety Info', icon: Shield },
  { key: 'materials', label: 'Materials', icon: BookOpen },
  { key: 'dimensions', label: 'Dimensions & Weight', icon: AlertTriangle },
]

export default function ProductCareTab({ product }: Props) {
  const [activeTab, setActiveTab] = useState<CareTab>('care')

  return (
    <div className="mt-8">
      <div className="border-b border-gray-200">
        <nav className="flex gap-6" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="mr-1 h-4 w-4 inline" /> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-6">
        {activeTab === 'care' && (
          <div className="prose max-w-none">
            <h3 className="font-semibold text-lg mb-3">Care Instructions</h3>
            {product.careInstructions && product.careInstructions.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-600">
                {product.careInstructions.map((instruction, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    {instruction}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No specific care instructions provided.</p>
            )}
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="prose max-w-none">
            <h3 className="font-semibold text-lg mb-3">Safety Information</h3>
            {product.safetyWarnings && product.safetyWarnings.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-600">
                {product.safetyWarnings.map((warning, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No specific safety warnings provided.</p>
            )}
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="prose max-w-none">
            <h3 className="font-semibold text-lg mb-3">Materials</h3>
            {product.material && product.material.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {product.material.map((mat, i) => (
                  <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">{mat}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Material information not specified.</p>
            )}
          </div>
        )}

        {activeTab === 'dimensions' && (
          <div className="prose max-w-none">
            <h3 className="font-semibold text-lg mb-3">Dimensions & Weight</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Dimensions</p>
                <p className="mt-1 text-lg font-semibold">
                  {product.dimensions
                    ? `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`
                    : 'Not specified'}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Weight</p>
                <p className="mt-1 text-lg font-semibold">
                  {product.weight ? `${product.weight} kg` : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
