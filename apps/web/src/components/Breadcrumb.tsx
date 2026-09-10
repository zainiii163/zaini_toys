import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  items: { label: string; path?: string }[]
}

export default function Breadcrumb({ items }: Props) {
  return (
    <nav className="mb-4 flex items-center gap-1 text-sm text-gray-500">
      <Link to="/" className="flex items-center gap-1 hover:text-blue-600">
        <Home className="h-3.5 w-3.5" /> Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 text-gray-400" />
          {item.path ? (
            <Link to={item.path} className="hover:text-blue-600">{item.label}</Link>
          ) : (
            <span className="font-medium text-gray-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
