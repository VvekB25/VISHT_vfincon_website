import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CheckCircle,
  Eye,
  FileEdit,
  FileText,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import BlogEditorModal from '../../components/BlogEditorModal'
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPosts,
  updateBlogPost,
} from '../../lib/supabase'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [actionSuccess, setActionSuccess] = useState('')

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await getBlogPosts({
        category: categoryFilter,
        search,
        status: statusFilter,
      })
      setPosts(data)
    } catch (err) {
      console.error('Failed to load blog posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchPosts, 150)
    return () => clearTimeout(timer)
  }, [statusFilter, categoryFilter, search])

  const handleCreateNew = () => {
    setSelectedPost(null)
    setIsModalOpen(true)
  }

  const handleEdit = (post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  const handleSave = async (formData) => {
    if (selectedPost) {
      await updateBlogPost(selectedPost.id, formData)
      setActionSuccess('Article updated successfully.')
    } else {
      await createBlogPost(formData)
      setActionSuccess('New article drafted successfully.')
    }
    fetchPosts()
    setTimeout(() => setActionSuccess(''), 4000)
  }

  const handleToggleStatus = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published'
    try {
      await updateBlogPost(post.id, { ...post, status: newStatus })
      setActionSuccess(`Article status changed to ${newStatus}.`)
      fetchPosts()
      setTimeout(() => setActionSuccess(''), 4000)
    } catch (err) {
      console.error('Status toggle failed:', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteBlogPost(id)
      setDeleteConfirmId(null)
      setActionSuccess('Article removed permanently.')
      fetchPosts()
      setTimeout(() => setActionSuccess(''), 4000)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const categories = [
    'All',
    'Taxation & Compliance',
    'Business Registration',
    'Audit & Assurance',
    'Accounting & Advisory',
  ]

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">Publications & Insights</span>
          <h1>Manage Blog Articles</h1>
          <p>Author, review, preview, publish, and manage corporate consultancy articles.</p>
        </div>
        <button type="button" className="button primary" onClick={handleCreateNew}>
          <Plus size={16} /> Draft New Article
        </button>
      </div>

      {actionSuccess && (
        <div className="form-success banner-success">
          <CheckCircle size={16} /> {actionSuccess}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={15} />
          <input
            type="search"
            placeholder="Search by title, excerpt, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filter-group">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Status: All</option>
            <option value="published">Status: Published</option>
            <option value="draft">Status: Draft</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="table-loading">Loading articles...</div>
        ) : posts.length === 0 ? (
          <div className="table-empty">
            <AlertCircle size={32} />
            <p>No articles match your search criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title & Excerpt</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Published Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="table-title-cell">
                      <strong>{post.title}</strong>
                      <small className="cell-sub">{post.excerpt}</small>
                      <small className="slug-tag">slug: /{post.slug}</small>
                    </td>
                    <td>
                      <span className="cat-badge">{post.category}</span>
                    </td>
                    <td>
                      <small>{post.author_name || 'VFINCON Desk'}</small>
                    </td>
                    <td>
                      <small>
                        {new Date(post.published_at || post.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </small>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(post)}
                        className={`status-btn ${post.status}`}
                        title="Click to toggle status"
                      >
                        <span className="status-dot"></span>
                        {post.status}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="table-action-btn edit"
                          onClick={() => handleEdit(post)}
                          title="Edit & Preview"
                        >
                          <FileEdit size={15} />
                        </button>
                        <button
                          type="button"
                          className="table-action-btn delete"
                          onClick={() => setDeleteConfirmId(post.id)}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-card modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon danger">
              <Trash2 size={24} />
            </div>
            <h3>Permanently Delete Article?</h3>
            <p>
              Are you sure you want to delete this publication? This action will permanently remove
              the article, comments, and interactions from the database.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button danger-btn"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create/Preview Modal */}
      <BlogEditorModal
        isOpen={isModalOpen}
        post={selectedPost}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

