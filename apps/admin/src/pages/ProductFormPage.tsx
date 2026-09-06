import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetProductQuery, useCreateProductMutation, useUpdateProductMutation } from '../app/services/product'
import { useGetCategoriesQuery } from '../app/services/category'
import { useGetBrandsQuery } from '../app/services/brand'

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const { data: existing } = useGetProductQuery(id || '', { skip: !isEdit })
  const { data: categoriesData } = useGetCategoriesQuery()
  const { data: brandsData } = useGetBrandsQuery()
  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()

  const [form, setForm] = useState({
    name: '', sku: '', description: '', shortDescription: '',
    price: '', salePrice: '', category: '', brand: '',
    ageMin: '', ageMax: '', availableStock: '',
    isFeatured: false, isNewArrival: false, isBestSeller: false, isTrending: false,
  })
  const [images, setImages] = useState<FileList | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (existing?.data) {
      const p = existing.data
      setForm({
        name: p.name, sku: p.sku, description: p.description, shortDescription: p.shortDescription || '',
        price: String(p.price), salePrice: p.salePrice ? String(p.salePrice) : '',
        category: (p.category as any)?._id || '', brand: (p.brand as any)?._id || '',
        ageMin: String(p.ageRange?.min || ''), ageMax: String(p.ageRange?.max || ''),
        availableStock: String(p.availableStock),
        isFeatured: p.isFeatured, isNewArrival: p.isNewArrival, isBestSeller: p.isBestSeller, isTrending: p.isTrending,
      })
    }
  }, [existing])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('sku', form.sku)
    fd.append('description', form.description)
    fd.append('shortDescription', form.shortDescription)
    fd.append('price', form.price)
    if (form.salePrice) fd.append('salePrice', form.salePrice)
    if (form.category) fd.append('category', form.category)
    if (form.brand) fd.append('brand', form.brand)
    fd.append('ageRange', JSON.stringify({ min: Number(form.ageMin) || 0, max: Number(form.ageMax) || 18 }))
    fd.append('availableStock', form.availableStock)
    fd.append('isFeatured', String(form.isFeatured))
    fd.append('isNewArrival', String(form.isNewArrival))
    fd.append('isBestSeller', String(form.isBestSeller))
    fd.append('isTrending', String(form.isTrending))
    if (images) {
      for (let i = 0; i < images.length; i++) fd.append('images', images[i])
    }

    try {
      if (isEdit && id) {
        await updateProduct({ id, body: fd }).unwrap()
      } else {
        await createProduct(fd).unwrap()
      }
      navigate('/products')
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to save product')
    }
  }

  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
  const categories = categoriesData?.data || []
  const brands = brandsData?.data || []

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{isEdit ? 'Edit Product' : 'New Product'}</h1>
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
        <div className="stat-card space-y-4">
          <h2 className="font-semibold">Basic Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1 block text-sm font-medium">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} required /></div>
            <div><label className="mb-1 block text-sm font-medium">SKU *</label><input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className={inputClass} required /></div>
          </div>
          <div><label className="mb-1 block text-sm font-medium">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} rows={4} /></div>
          <div><label className="mb-1 block text-sm font-medium">Short Description</label><input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} /></div>
        </div>

        <div className="stat-card space-y-4">
          <h2 className="font-semibold">Pricing & Stock</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className="mb-1 block text-sm font-medium">Price (Rs.) *</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} required min="0" /></div>
            <div><label className="mb-1 block text-sm font-medium">Sale Price (Rs.)</label><input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} className={inputClass} min="0" /></div>
            <div><label className="mb-1 block text-sm font-medium">Stock *</label><input type="number" value={form.availableStock} onChange={(e) => setForm({ ...form, availableStock: e.target.value })} className={inputClass} required min="0" /></div>
          </div>
        </div>

        <div className="stat-card space-y-4">
          <h2 className="font-semibold">Category & Brand</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                <option value="">Select category</option>
                {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Brand</label>
              <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={inputClass}>
                <option value="">Select brand</option>
                {brands.map((b: any) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1 block text-sm font-medium">Age Min</label><input type="number" value={form.ageMin} onChange={(e) => setForm({ ...form, ageMin: e.target.value })} className={inputClass} min="0" /></div>
            <div><label className="mb-1 block text-sm font-medium">Age Max</label><input type="number" value={form.ageMax} onChange={(e) => setForm({ ...form, ageMax: e.target.value })} className={inputClass} min="0" /></div>
          </div>
        </div>

        <div className="stat-card space-y-4">
          <h2 className="font-semibold">Images</h2>
          <input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files)} className="w-full text-sm" />
          {isEdit && existing?.data?.images?.length && (
            <div className="flex gap-2">
              {existing.data.images.map((img: any, i: number) => (
                <img key={i} src={img.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>

        <div className="stat-card space-y-4">
          <h2 className="font-semibold">Flags</h2>
          <div className="flex flex-wrap gap-4">
            {(['isFeatured', 'isNewArrival', 'isBestSeller', 'isTrending'] as const).map((flag) => (
              <label key={flag} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form[flag]} onChange={(e) => setForm({ ...form, [flag]: e.target.checked })} className="rounded border-gray-300" />
                {flag.replace(/^is/, '').replace(/([A-Z])/g, ' $1').trim()}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
            {isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/products')} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  )
}
