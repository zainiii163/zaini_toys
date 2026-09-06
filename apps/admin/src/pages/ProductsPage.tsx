import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useGetProductsQuery, useDeleteProductMutation } from '../app/services/product'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteProduct] = useDeleteProductMutation()
  const { data, isLoading } = useGetProductsQuery({ page: String(page), limit: '20', search })

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) {
      await deleteProduct(id)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/products/new" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="stat-card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Search products..." />
        </div>
      </div>

      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="stat-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data?.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img src={p.images?.[0]?.url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.sku}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">Rs. {(p.salePrice ?? p.price).toLocaleString()}</td>
                  <td className="px-4 py-3">{p.availableStock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="flex items-center gap-2 px-4 py-3">
                    <Link to={`/products/${p._id}/edit`} className="rounded p-1 hover:bg-gray-100"><Pencil className="h-4 w-4 text-gray-600" /></Link>
                    <button onClick={() => handleDelete(p._id)} className="rounded p-1 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-500">Page {data.pagination.page} of {data.pagination.pages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50">Prev</button>
                <button onClick={() => setPage(Math.min(data.pagination.pages, page + 1))} disabled={page >= data.pagination.pages} className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
