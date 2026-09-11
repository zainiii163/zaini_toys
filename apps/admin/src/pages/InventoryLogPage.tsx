import { Package } from 'lucide-react'

export default function InventoryLogPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Inventory Log</h1>
      <div className="stat-card flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-12 w-12 text-gray-300" />
        <h2 className="mt-4 font-semibold text-gray-700">Coming soon</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          Inventory movement history isn't wired to the API yet. Stock changes are recorded through the product
          and purchase-order flows; a full audit log will appear here in a future release.
        </p>
      </div>
    </div>
  )
}