import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Ban,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import {
  deleteComment,
  getAllComments,
  updateCommentStatus,
} from '../../lib/supabase'

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending') // 'pending', 'approved', 'rejected', 'all'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [actionSuccess, setActionSuccess] = useState('')

  const fetchComments = async () => {
    try {
      setLoading(true)
      const data = await getAllComments({ status: activeTab })
      setComments(data)
    } catch (err) {
      console.error('Failed to load comments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [activeTab])

  const handleUpdateStatus = async (commentId, newStatus) => {
    try {
      await updateCommentStatus(commentId, newStatus)
      setActionSuccess(`Comment status updated to ${newStatus}.`)
      fetchComments()
      setTimeout(() => setActionSuccess(''), 4000)
    } catch (err) {
      console.error('Status update failed:', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteComment(id)
      setDeleteConfirmId(null)
      setActionSuccess('Comment permanently deleted.')
      fetchComments()
      setTimeout(() => setActionSuccess(''), 4000)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">Visitor Engagement</span>
          <h1>Comment Moderation</h1>
          <p>Review, approve, or reject visitor feedback before it appears on public articles.</p>
        </div>
      </div>

      {actionSuccess && (
        <div className="form-success banner-success">
          <CheckCircle size={16} /> {actionSuccess}
        </div>
      )}

      {/* Moderation Status Tabs */}
      <div className="moderation-tab-bar">
        {[
          { key: 'pending', label: 'Pending Review', icon: Clock },
          { key: 'approved', label: 'Approved', icon: Check },
          { key: 'rejected', label: 'Rejected', icon: Ban },
          { key: 'all', label: 'All Comments', icon: MessageSquare },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`moderation-tab-btn ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Comments List / Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="table-loading">Loading comments for moderation...</div>
        ) : comments.length === 0 ? (
          <div className="table-empty">
            <ShieldCheck size={36} style={{ color: '#2e7d32' }} />
            <h4>No Comments in this Queue</h4>
            <p>
              {activeTab === 'pending'
                ? 'All visitor comments have been moderated. Good job!'
                : `There are currently no comments with status "${activeTab}".`}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Comment & Contributor</th>
                  <th>Article Reference</th>
                  <th>Submitted At</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.id}>
                    <td className="comment-content-cell">
                      <strong className="commenter-name">{comment.author_name}</strong>
                      {/* Safe text rendering, escaping any visitor input */}
                      <p className="comment-text-preview">{comment.content}</p>
                    </td>
                    <td>
                      {comment.blog_posts?.slug ? (
                        <Link
                          to={`/blog/${comment.blog_posts.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="table-post-link"
                        >
                          <span>{comment.blog_posts.title}</span>
                          <ExternalLink size={12} />
                        </Link>
                      ) : (
                        <span className="text-muted">{comment.blog_posts?.title || 'Unknown Post'}</span>
                      )}
                    </td>
                    <td>
                      <small>
                        {new Date(comment.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </small>
                    </td>
                    <td>
                      <span className={`status-pill status-${comment.status}`}>
                        {comment.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {comment.status !== 'approved' && (
                          <button
                            type="button"
                            className="moderation-action-btn approve"
                            onClick={() => handleUpdateStatus(comment.id, 'approved')}
                            title="Approve Comment"
                          >
                            <Check size={14} /> Approve
                          </button>
                        )}
                        {comment.status !== 'rejected' && (
                          <button
                            type="button"
                            className="moderation-action-btn reject"
                            onClick={() => handleUpdateStatus(comment.id, 'rejected')}
                            title="Reject Comment"
                          >
                            <Ban size={14} /> Reject
                          </button>
                        )}
                        <button
                          type="button"
                          className="table-action-btn delete"
                          onClick={() => setDeleteConfirmId(comment.id)}
                          title="Delete Permanently"
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
            <h3>Permanently Delete Comment?</h3>
            <p>
              Are you sure you want to delete this comment? It will be permanently expunged from the
              database.
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
    </div>
  )
}

