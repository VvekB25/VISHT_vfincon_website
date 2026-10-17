import { useEffect, useState } from 'react'
import { AlertCircle, Eye, FileEdit, X } from 'lucide-react'

export default function BlogEditorModal({ isOpen, post, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('edit') // 'edit' or 'preview'
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Taxation & Compliance',
    tags: '',
    excerpt: '',
    content: '',
    author_name: 'VFINCON Advisory Team',
    featured_image: '',
    published_at: new Date().toISOString().slice(0, 16),
    status: 'draft',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        category: post.category || 'Taxation & Compliance',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        author_name: post.author_name || 'VFINCON Advisory Team',
        featured_image: post.featured_image || '',
        published_at: post.published_at
          ? new Date(post.published_at).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        status: post.status || 'draft',
      })
    } else {
      setFormData({
        title: '',
        slug: '',
        category: 'Taxation & Compliance',
        tags: 'Income Tax, Compliance, Advisory',
        excerpt: '',
        content: '',
        author_name: 'VFINCON Advisory Team',
        featured_image: '',
        published_at: new Date().toISOString().slice(0, 16),
        status: 'draft',
      })
    }
    setActiveTab('edit')
    setError('')
  }, [post, isOpen])

  if (!isOpen) return null

  const handleTitleChange = (e) => {
    const val = e.target.value
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !post || !prev.slug
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : prev.slug,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Article title is required.')
      return
    }
    if (!formData.slug.trim()) {
      setError('URL slug is required.')
      return
    }
    if (!formData.excerpt.trim()) {
      setError('Short excerpt is required.')
      return
    }
    if (!formData.content.trim()) {
      setError('Article content is required.')
      return
    }

    try {
      setSaving(true)
      const tagsArray = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []

      await onSave({
        ...formData,
        tags: tagsArray,
        published_at: new Date(formData.published_at).toISOString(),
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save blog post.')
    } finally {
      setSaving(false)
    }
  }

  const categories = [
    'Taxation & Compliance',
    'Business Registration',
    'Audit & Assurance',
    'Accounting & Advisory',
    'Corporate Law',
    'Financial Planning',
  ]

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">{post ? 'Edit Publication' : 'New Publication'}</span>
            <h2>{post ? 'Update Blog Article' : 'Draft New Article'}</h2>
          </div>
          <div className="modal-header-actions">
            <div className="tab-pill-group">
              <button
                type="button"
                className={`tab-pill ${activeTab === 'edit' ? 'active' : ''}`}
                onClick={() => setActiveTab('edit')}
              >
                <FileEdit size={14} /> Editor
              </button>
              <button
                type="button"
                className={`tab-pill ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <Eye size={14} /> Live Preview
              </button>
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
              <X size={20} />
            </button>
          </div>
        </div>

        {activeTab === 'preview' ? (
          <div className="editor-preview-panel">
            {formData.featured_image && (
              <div className="preview-image-wrap">
                <img src={formData.featured_image} alt="Featured article banner" />
              </div>
            )}
            <div className="preview-header">
              <span className="cat-badge">{formData.category}</span>
              <h1>{formData.title || 'Untitled Article'}</h1>
              <div className="preview-meta">
                <span>By {formData.author_name}</span> •{' '}
                <span>{new Date(formData.published_at).toLocaleDateString()}</span> •{' '}
                <span className={`status-pill ${formData.status}`}>Status: {formData.status}</span>
              </div>
            </div>
            <p className="preview-excerpt">
              <em>{formData.excerpt || 'Article summary excerpt...'}</em>
            </p>
            <div className="preview-body">
              {formData.content
                ? formData.content.split('\n\n').map((para, i) => <p key={i}>{para}</p>)
                : <p className="text-muted">No content written yet.</p>}
            </div>
            <div className="modal-actions" style={{ marginTop: '24px' }}>
              <button type="button" className="button secondary" onClick={() => setActiveTab('edit')}>
                Back to Edit
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            {error && (
              <div className="form-error">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="form-row">
              <label>
                Article Title *
                <input
                  type="text"
                  required
                  placeholder="e.g. Navigating Corporate Tax Compliances"
                  value={formData.title}
                  onChange={handleTitleChange}
                />
              </label>

              <label>
                URL Slug *
                <input
                  type="text"
                  required
                  placeholder="navigating-corporate-tax-compliances"
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
                  <option value="published">Published (Live for visitors)</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Author Name / Desk *
                <input
                  type="text"
                  required
                  placeholder="VFINCON Tax Desk"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                />
              </label>

              <label>
                Publish Date & Time *
                <input
                  type="datetime-local"
                  required
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Featured Image URL (Optional)
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                />
              </label>

              <label>
                Tags (Comma separated)
                <input
                  type="text"
                  placeholder="Income Tax, MSME, 43B(h), Filing"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </label>
            </div>

            <label>
              Short Excerpt / Lead Summary *
              <textarea
                required
                rows={3}
                placeholder="A compelling 2-sentence summary that appears on blog cards and search results..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </label>

            <label>
              Full Article Body *
              <textarea
                required
                rows={10}
                placeholder="Write your article in structured paragraphs or markdown sections..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </label>

            <div className="modal-actions">
              <button type="button" className="button secondary" onClick={onClose} disabled={saving}>
                Cancel
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={() => setActiveTab('preview')}
              >
                <Eye size={14} /> Preview
              </button>
              <button type="submit" className="button primary" disabled={saving}>
                {saving ? 'Saving...' : post ? 'Update Article' : 'Save Article'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

