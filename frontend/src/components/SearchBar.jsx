import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search updates and articles...' }) {
  return (
    <div className="search-bar-wrap">
      <Search size={16} className="search-icon" aria-hidden="true" />
      <input
        type="search"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={() => onChange('')}
          aria-label="Clear search text"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

