import { useState, useRef } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCreateProductMutation } from '../app/services/product'

export default function CsvImport() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null)
  const [createProduct] = useCreateProductMutation()

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f && !f.name.endsWith('.csv')) {
      toast.error('Please select a CSV file')
      return
    }
    setFile(f || null)
    setResult(null)
  }

  const onImport = async () => {
    if (!file) return
    setImporting(true)
    setResult(null)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter((l) => l.trim())
      if (lines.length < 2) {
        toast.error('CSV must have a header row and at least one data row')
        setImporting(false)
        return
      }

      const header = lines[0].toLowerCase()
      if (!header.includes('name') || !header.includes('price')) {
        toast.error('CSV must have at least "name" and "price" columns')
        setImporting(false)
        return
      }

      // Parse CSV
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''))
      const rows = lines.slice(1)

      let success = 0
      const errors: string[] = []

      for (let i = 0; i < rows.length; i++) {
        const values = rows[i].split(',').map((v) => v.trim().replace(/['"]/g, ''))
        const obj: Record<string, string> = {}
        headers.forEach((h, idx) => { obj[h] = values[idx] || '' })

        if (!obj.name || !obj.price) {
          errors.push(`Row ${i + 2}: Missing name or price`)
          continue
        }

        const body = new FormData()
        body.append('name', obj.name)
        body.append('slug', obj.slug || obj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
        body.append('price', String(Number(obj.price) || 0))
        if (obj.saleprice) body.append('salePrice', String(Number(obj.saleprice)))
        body.append('sku', obj.sku || `SKU-${Date.now()}-${i}`)
        body.append('description', obj.description || '')
        body.append('shortDescription', obj.short_description || '')
        body.append('availableStock', String(Number(obj.stock || obj.availablestock || 0)))
        body.append('minStockLevel', String(Number(obj.minstocklevel || 5)))
        if (obj.weight) body.append('weight', String(Number(obj.weight)))
        if (obj.agerange) body.append('ageRange', obj.agerange)
        if (obj.material) body.append('material', obj.material)

        try {
          await createProduct(body).unwrap()
          success++
        } catch (err: any) {
          errors.push(`Row ${i + 2}: ${err?.data?.error || 'API error'}`)
        }
      }

      setResult({ success, errors })
      if (success > 0) toast.success(`${success} products imported`)
      if (errors.length > 0) toast.error(`${errors.length} rows failed`)
    } catch {
      toast.error('Failed to parse CSV file')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="stat-card">
      <h3 className="mb-3 font-semibold">Import Products from CSV</h3>
      <p className="mb-3 text-xs text-gray-500">
        CSV must have columns: <code>name</code>, <code>price</code>. Optional: sku, description, saleprice, stock, ageRange, material
      </p>

      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={onFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          <FileText className="h-4 w-4" /> {file ? file.name : 'Choose CSV'}
        </button>
        <button
          onClick={onImport}
          disabled={!file || importing}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {importing ? 'Importing...' : 'Import'}
        </button>
      </div>

      {result && (
        <div className="mt-4 rounded-lg border p-3">
          {result.success > 0 && (
            <p className="flex items-center gap-1 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" /> {result.success} products imported successfully
            </p>
          )}
          {result.errors.length > 0 && (
            <div className="mt-2">
              <p className="flex items-center gap-1 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" /> {result.errors.length} errors:
              </p>
              <ul className="mt-1 max-h-32 overflow-y-auto text-xs text-red-600">
                {result.errors.map((e, i) => <li key={i}>• {e}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
