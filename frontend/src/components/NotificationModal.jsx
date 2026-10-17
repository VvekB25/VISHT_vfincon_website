import { useEffect, useState } from 'react'
import { AlertCircle, Check, X } from 'lucide-react'

export default function NotificationModal({ isOpen, notification, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'GST',
    summary: '',
    content: '',
    source_name: '',
    source_url: '',
    attachment_url: '',
    published_at: new Date().toISOString().slice(0, 16),
    expires_at: '',
    status: 'draft',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title || '',
        slug: notification.slug || '',
        category: notification.category || 'GST',
        summary: notification.summary || '',
        content: notification.content || '',
        source_name: notification.source_name || '',
        source_url: notification.source_url || '',
        attachment_url: notification.attachment_url || '',
        published_at: notification.published_at
          ? new Date(notification.published_at).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        expires_at: notification.expires_at
          ? new Date(notification.expires_at).toISOString().slice(0, 16)
          : '',
        status: notification.status || 'draft',
      })
    } else {
      setFormData({
        title: '',
        slug: '',
        category: 'GST',
        summary: '',
        content: '',
        source_name: '',
        source_url: '',
        attachment_url: '',
        published_at: new Date().toISOString().slice(0, 16),
        expires_at: '',
        status: 'draft',
      })
    }
    setError('')
  }, [notification, isOpen])

  if (!isOpen) return null

  const handleTitleChange = (e) => {
    const val = e.target.value
    setFormData((prev) => ({
      ...prev,
      title: val,
      // Auto-generate slug if creating a new notification or if slug is empty
      slug: !notification || !prev.slug
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : prev.slug,
    }))
  }

  const isValidUrl = (string) => {
    if (!string) return true
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Title is required.')
      return
    }
    if (!formData.slug.trim()) {
      setError('URL slug is required.')
      return
    }
    if (!formData.summary.trim()) {
      setError('Summary is required.')
      return
    }
    if (!formData.content.trim()) {
      setError('Detailed content is required.')
      return
    }
    if (!formData.source_name.trim()) {
      setError('Official source name is required.')
      return
    }
    if (formData.source_url && !isValidUrl(formData.source_url)) {
      setError('Please provide a valid official source URL starting with http:// or https://')
      return
    }
    if (formData.attachment_url && !isValidUrl(formData.attachment_url)) {
      setError('Please provide a valid attachment URL starting with http:// or https://')
      return
    }

    try {
      setSaving(true)
      await onSave({
        ...formData,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        published_at: new Date(formData.published_at).toISOString(),
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save notification.')
    } finally {
      setSaving(false)
    }
  }

  const categories = ['GST', 'Income Tax', 'MCA/ROC', 'Accounting', 'Compliance', 'General']

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">{notification ? 'Edit Advisory' : 'Create Advisory'}</span>
            <h2>{notification ? 'Update Regulatory Notification' : 'New Regulatory Notification'}</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="form-error">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="form-row">
            <label>
              Title *
              <input
                type="text"
                required
                placeholder="e.g. Mandatory 2FA for E-Way Bill and E-Invoice"
                value={formData.title}
                onChange={handleTitleChange}
              />
            </label>

            <label>
              URL Slug *
              <input
                type="text"
                required
                placeholder="mandatory-2fa-eway-bill"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Category *
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Publication Status *
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Draft (Private, not visible publicly)</option>
                <option value="published">Published (Live on website)</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Publish Date & Time *
              <input
                type="datetime-local"
                required
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              />
            </label>

            <label>
              Expiry Date (Optional)
              <input
                type="datetime-local"
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Official Source Name *
              <input
                type="text"
                required
                placeholder="e.g. Goods & Services Tax Network (GSTN)"
                value={formData.source_name}
                onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
              />
            </label>

            <label>
              Original Source URL *
              <input
                type="url"
                required
                placeholder="https://services.gst.gov.in/..."
                value={formData.source_url}
                onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
              />
            </label>
          </div>

          <label>
            Optional Attachment / PDF Link
            <input
              type="url"
              placeholder="https://example.com/circular.pdf"
              value={formData.attachment_url}
              onChange={(e) => setFormData({ ...formData, attachment_url: e.target.value })}
            />
          </label>

          <label>
            Short Summary / Key Highlights *
            <textarea
              required
              rows={3}
              placeholder="A concise 2-3 sentence overview of this notification for cards and search results..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          </label>

          <label>
            Full Advisory / Analysis Content *
            <textarea
              required
              rows={8}
              placeholder="Detailed explanation, applicability criteria, implications, and practical recommendations..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </label>

          <div className="modal-disclaimer-note">
            <AlertCircle size={15} />
            <span>
              <strong>Editorial Notice:</strong> Explanations authored here represent VFINCON professional advisory and will be displayed alongside the verified link to the official government gazette.
            </span>
          </div>

          <div className="modal-actions">
            <button type="button" className="button secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="button primary" disabled={saving}>
              {saving ? 'Saving...' : notification ? 'Update Notification' : 'Create Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

