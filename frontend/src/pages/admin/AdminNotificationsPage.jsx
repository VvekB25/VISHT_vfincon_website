import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Eye,
  FileEdit,
  Globe,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react'
import NotificationModal from '../../components/NotificationModal'
import {
  createNotification,
  deleteNotification,
  getNotifications,
  updateNotification,
} from '../../lib/supabase'

export default function AdminNotificationsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [actionSuccess, setActionSuccess] = useState('')

  const fetchItems = async () => {
    try {
      setLoading(true)
      const data = await getNotifications({
        category: categoryFilter,
        search,
        status: statusFilter,
        includeExpired: true,
      })
      setItems(data)
    } catch (err) {
      console.error('Failed to load notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchItems, 150)
    return () => clearTimeout(timer)
  }, [statusFilter, categoryFilter, search])

  const handleCreateNew = () => {
    setSelectedItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleSave = async (formData) => {
    if (selectedItem) {
      await updateNotification(selectedItem.id, formData)
      setActionSuccess('Notification updated successfully.')
    } else {
      await createNotification(formData)
      setActionSuccess('Notification created successfully.')
    }
    fetchItems()
    setTimeout(() => setActionSuccess(''), 4000)
  }

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published'
    try {
      await updateNotification(item.id, { ...item, status: newStatus })
      setActionSuccess(`Notification marked as ${newStatus}.`)
      fetchItems()
      setTimeout(() => setActionSuccess(''), 4000)
    } catch (err) {
      console.error('Status toggle failed:', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id)
      setDeleteConfirmId(null)
      setActionSuccess('Notification deleted permanently.')
      fetchItems()
      setTimeout(() => setActionSuccess(''), 4000)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const categories = ['All', 'GST', 'Income Tax', 'MCA/ROC', 'Accounting', 'Compliance', 'General']

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">Regulatory Compliance</span>
          <h1>Manage Notifications & Circulars</h1>
          <p>Create, update, publish, or archive statutory and regulatory advisories.</p>
        </div>
        <button type="button" className="button primary" onClick={handleCreateNew}>
          <Plus size={16} /> New Advisory
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
            placeholder="Search by title or summary..."
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

      {/* Notifications Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="table-loading">Loading notifications...</div>
        ) : items.length === 0 ? (
          <div className="table-empty">
            <AlertCircle size={32} />
            <p>No notifications match the chosen criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title & Summary</th>
                  <th>Category</th>
                  <th>Source Reference</th>
                  <th>Published Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="table-title-cell">
                      <strong>{item.title}</strong>
                      <small className="cell-sub">{item.summary}</small>
                      <small className="slug-tag">slug: /{item.slug}</small>
                    </td>
                    <td>
                      <span className={`cat-badge cat-${(item.category || '').toLowerCase().replace(/[^a-z]/g, '')}`}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <div className="table-source-cell">
                        <span>{item.source_name}</span>
                        {item.source_url && (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="source-link"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <small>
                        {new Date(item.published_at || item.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </small>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        className={`status-btn ${item.status}`}
                        title="Click to toggle status"
                      >
                        <span className="status-dot"></span>
                        {item.status}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="table-action-btn edit"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <FileEdit size={15} />
                        </button>
                        <button
                          type="button"
                          className="table-action-btn delete"
                          onClick={() => setDeleteConfirmId(item.id)}
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
            <h3>Permanently Delete Notification?</h3>
            <p>
              Are you sure you want to delete this notification? This action cannot be undone and
              will remove the advisory from the public portal.
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

      {/* Edit/Create Modal */}
      <NotificationModal
        isOpen={isModalOpen}
        notification={selectedItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

