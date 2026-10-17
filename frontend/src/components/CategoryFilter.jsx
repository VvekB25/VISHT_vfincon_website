export default function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div className="category-filter-wrap" role="tablist" aria-label="Filter by category">
      {categories.map((cat) => {
        const isActive = activeCategory === cat
        return (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`filter-pill ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(cat)}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}

