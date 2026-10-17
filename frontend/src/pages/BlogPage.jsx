import { useEffect, useState } from 'react'
import { BookOpen, RefreshCw } from 'lucide-react'
import BlogCard from '../components/BlogCard'
import CategoryFilter from '../components/CategoryFilter'
import SearchBar from '../components/SearchBar'
import { getBlogPosts } from '../lib/supabase'
import { CTASection } from './HomePage'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    'All',
    'Taxation & Compliance',
    'Business Registration',
    'Audit & Assurance',
    'Accounting & Advisory',
  ]

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await getBlogPosts({
        category: activeCategory,
        search: searchQuery,
        status: 'published',
      })
      setPosts(data)
    } catch (err) {
      console.error('Failed to load blog posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts()
    }, 150)
    return () => clearTimeout(timer)
  }, [activeCategory, searchQuery])

  return (
    <main>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">Insights & Knowledge</span>
          <h1>Articles & Perspectives</h1>
          <p>
            Actionable insights, regulatory breakdowns, and strategic perspectives on Indian
            corporate finance, taxation, compliance, and growth.
          </p>
        </div>
      </section>

      <section className="section blog-page-section">
        <div className="container">
          {/* Controls: Search and Categories */}
          <div className="listing-controls">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search articles by title, topic, or keyword..."
            />
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>

          {/* Results count & status */}
          <div className="listing-status-row">
            <span>
              Showing <strong>{posts.length}</strong>{' '}
              {posts.length === 1 ? 'article' : 'articles'}
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </span>
            {(activeCategory !== 'All' || searchQuery) && (
              <button
                type="button"
                className="clear-filter-btn"
                onClick={() => {
                  setActiveCategory('All')
                  setSearchQuery('')
                }}
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Blog Grid or Skeletons / Empty */}
          {loading ? (
            <div className="blog-skeleton-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="blog-skeleton-card">
                  <div className="skeleton-media"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-bar short"></div>
                    <div className="skeleton-bar title"></div>
                    <div className="skeleton-bar medium"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state-card">
              <BookOpen size={42} className="empty-icon" />
              <h3>No Articles Found</h3>
              <p>
                {searchQuery || activeCategory !== 'All'
                  ? 'No published articles match your current search query. Try adjusting your search term or select another category.'
                  : 'No articles have been published yet. Please check back soon for our latest insights.'}
              </p>
              {(searchQuery || activeCategory !== 'All') && (
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => {
                    setActiveCategory('All')
                    setSearchQuery('')
                  }}
                >
                  <RefreshCw size={14} /> Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </main>
  )
}

