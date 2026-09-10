import { useGetCategoryTreeQuery } from '../app/services/category'

interface Props {
  selectedCategory: string
  onSelectSubcategory: (subslug: string) => void
}

const SUBCATEGORY_COLORS = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-teal-100 text-teal-700 border-teal-200',
  'bg-red-100 text-red-700 border-red-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
]

export default function SubcategoryChips({ selectedCategory, onSelectSubcategory }: Props) {
  const { data: categoriesData } = useGetCategoryTreeQuery()
  const categories = categoriesData?.data || []
  const mainCategory = categories.find((c) => c.slug === selectedCategory)
  const subcategories = mainCategory?.children || []

  if (subcategories.length === 0) return null

  return (
    <div className="mb-4">
      <p className="mb-2 text-sm font-medium text-gray-600">Filter by subcategory:</p>
      <div className="flex flex-wrap gap-2">
        {subcategories.map((sub, i) => (
          <button
            key={sub.slug}
            onClick={() => onSelectSubcategory(sub.slug)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:opacity-80 ${SUBCATEGORY_COLORS[i % SUBCATEGORY_COLORS.length]}`}
          >
            {sub.name}
          </button>
        ))}
      </div>
    </div>
  )
}
