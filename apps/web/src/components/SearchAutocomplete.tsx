import { useState, useEffect, useRef } from 'react'
import { Search, Clock, TrendingUp, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../app/api'

const POPULAR_SEARCHES = ['Lego', 'Remote control car', 'Dolls', 'STEM kit', 'Board games', 'Outdoor toys']

export default function SearchAutocomplete() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('recent_searches')
      if (stored) setRecentSearches(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`)
        setSuggestions(res.data.data || [])
      } catch { setSuggestions([]) }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const saveRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 8)
    setRecentSearches(updated)
    localStorage.setItem('recent_searches', JSON.stringify(updated))
  }

  const onSearch = (term: string) => {
    if (!term.trim()) return
    saveRecent(term.trim())
    setShowDropdown(false)
    setQuery('')
    navigate(`/shop?search=${encodeURIComponent(term.trim())}`)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch(query)
  }

  const clearRecent = () => {
    setRecentSearches([])
    localStorage.removeItem('recent_searches')
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true) }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={onKeyDown}
          placeholder="Search toys, brands, categories..."
          className="input-toy w-full pl-10 pr-4"
        />
        {query && (
          <button onClick={() => { setQuery(''); inputRef.current?.focus() }} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
          {/* Search suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="px-2 py-1 text-xs font-medium text-gray-400">Suggestions</p>
              {suggestions.map((s) => (
                <button key={s} onClick={() => onSearch(s)} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-gray-50">
                  <Search className="h-3.5 w-3.5 text-gray-400" />
                  <span dangerouslySetInnerHTML={{ __html: s.replace(new RegExp(`(${query})`, 'gi'), '<b>$1</b>') }} />
                </button>
              ))}
            </div>
          )}

          {/* Recent searches */}
          {recentSearches.length > 0 && query.length < 2 && (
            <div className="p-2 border-t border-gray-100">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-medium text-gray-400">Recent Searches</span>
                <button onClick={clearRecent} className="text-xs text-blue-500 hover:underline">Clear</button>
              </div>
              {recentSearches.map((s) => (
                <button key={s} onClick={() => onSearch(s)} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-gray-50">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Popular searches */}
          {query.length < 2 && (
            <div className="p-2 border-t border-gray-100">
              <p className="px-2 py-1 text-xs font-medium text-gray-400">Popular Searches</p>
              <div className="flex flex-wrap gap-1.5 px-2 py-1">
                {POPULAR_SEARCHES.map((s) => (
                  <button key={s} onClick={() => onSearch(s)} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
