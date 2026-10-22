import { useEffect, useState } from 'react'
import { Bell, RefreshCw, Sparkles } from 'lucide-react'
import CategoryFilter from '../components/CategoryFilter'
import NotificationCard from '../components/NotificationCard'
import SearchBar from '../components/SearchBar'
import { getNotifications } from '../lib/supabase'
import CTASection from '../components/CTASection'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', 'GST', 'Income Tax', 'MCA/ROC', 'Accounting', 'Compliance', 'General']

  const fetchList = async () => {
    try {
      setLoading(true)
      const data = await getNotifications({
        category: activeCategory,
        search: searchQuery,
        status: 'published',
        includeExpired: false,
      })
      setNotifications(data)
    } catch (err) {
      console.error('Failed to load notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchList()
    }, 150)
    return () => clearTimeout(timer)
  }, [activeCategory, searchQuery])

  return (
    <main>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">Regulatory & Statutory Updates</span>
          <h1>Notifications & Circulars</h1>
          <p>
            Stay informed on essential GST, Direct Tax, MCA/ROC and statutory compliance
            advisories curated and analyzed for Indian enterprises.
          </p>
        </div>
      </section>

      <section className="section notif-page-section">
        <div className="container">
          {/* Controls: Search and Category Filter */}
          <div className="listing-controls">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search circulars, notifications by keyword..."
            />
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>

          {/* Results count & clear filters */}
          <div className="listing-status-row">
            <span>
              Showing <strong>{notifications.length}</strong> active{' '}
              {notifications.length === 1 ? 'notification' : 'notifications'}
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

          {/* Grid or Empty/Loading State */}
          {loading ? (
            <div className="card-skeleton-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="card-skeleton">
                  <div className="skeleton-bar short"></div>
                  <div className="skeleton-bar title"></div>
                  <div className="skeleton-bar medium"></div>
                  <div className="skeleton-bar full"></div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="empty-state-card">
              <Bell size={42} className="empty-icon" />
              <h3>No Notifications Found</h3>
              <p>
                {searchQuery || activeCategory !== 'All'
                  ? 'There are no active notifications matching your filter criteria. Try resetting the category or search keywords.'
                  : 'There are no active statutory notifications published at this moment. Check back soon for recent regulatory developments.'}
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
            <div className="notifications-grid">
              {notifications.map((item) => (
                <NotificationCard key={item.id} notification={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </main>
  )
}

