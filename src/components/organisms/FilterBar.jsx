import { useSearchParams } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { X } from 'lucide-react' // Added for a clear-filter icon

const CATEGORIES = [
  { label: 'All',       value: 'all' },
  { label: 'Hoodies',   value: 'hoodie' },
  { label: 'T-Shirts',  value: 'tshirt' },
  { label: 'Polo Shirts',value: 'polo' },
  { label: 'Jackets',   value: 'jacket' },
  { label: 'Bags',      value: 'bags' },
]

const SORT_OPTIONS = [
  { label: 'Featured',          value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Rating',        value: 'rating' },
  { label: 'Newest',             value: 'newest' },
]

export default function FilterBar({ totalCount }) {
  const [params, setParams] = useSearchParams()
  
  // 1. Extract values with defaults
  const activeCategory = params.get('category') || 'all'
  const activeSort     = params.get('sort')     || 'featured'
  const hasFilters     = activeCategory !== 'all' || activeSort !== 'featured'

  // 2. Generic filter setter
  function setFilter(key, value) {
    setParams(prev => {
      const next = new URLSearchParams(prev)
      if (value === 'all' || value === 'featured') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
      return next
    }, { replace: true }) // 'replace' prevents the back-button from getting clogged
  }

  const clearAll = () => setParams({})

  return (
    <div className="sticky top-0 z-30 border-b border-brand-border bg-white/80 backdrop-blur-md">
      <div className="section-inner py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Category chips */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilter('category', cat.value)}
              className={cn(
                'font-head text-[.72rem] font-bold tracking-[.05em] uppercase',
                'px-4 py-1.5 rounded-full border transition-all duration-200',
                activeCategory === cat.value
                  ? 'bg-purple text-white border-purple shadow-md'
                  : 'border-brand-border text-frill-600 hover:border-purple hover:text-purple bg-white'
              )}
            >
              {cat.label}
            </button>
          ))}

          {/* 3. "Clear" button appears only when needed */}
          {hasFilters && (
            <button 
              onClick={clearAll}
              className="flex items-center gap-1 text-[.65rem] font-bold uppercase text-magenta hover:underline ml-2"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Right side — count + sort */}
        <div className="flex items-center gap-4 ml-auto">
          <span className="hidden sm:block text-[.8rem] font-medium text-frill-400">
            Showing <span className="text-purple font-bold">{totalCount}</span> products
          </span>
          
          <div className="relative">
            <select
              value={activeSort}
              onChange={e => setFilter('sort', e.target.value)}
              className="appearance-none font-head text-[.78rem] font-bold text-purple
                          border border-brand-border rounded-frill pl-4 pr-10 py-2
                          bg-white focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple
                          cursor-pointer transition-all"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {/* Custom arrow for the select */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-frill-400">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}