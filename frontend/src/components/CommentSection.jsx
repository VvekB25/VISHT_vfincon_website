import { useEffect, useState } from 'react'
import { Check, MessageSquare, Send, ShieldCheck, User } from 'lucide-react'
import { getPostComments, submitComment } from '../lib/supabase'

export default function CommentSection({ postId, postTitle }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const loadComments = async () => {
      try {
        setLoading(true)
        const list = await getPostComments(postId, 'approved')
        if (mounted) setComments(list)
      } catch (err) {
        console.error('Failed to load comments:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (postId) loadComments()
    return () => {
      mounted = false
    }
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const name = authorName.trim()
    const text = content.trim()

    if (name.length < 2) {
      setError('Please provide your name (at least 2 characters).')
      return
    }
    if (text.length < 3) {
      setError('Please provide a comment of at least 3 characters.')
      return
    }

    try {
      setSubmitting(true)
      await submitComment({
        postId,
        authorName: name,
        content: text,
      })
      setSubmittedSuccess(true)
      setContent('')
      setAuthorName('')
      setTimeout(() => setSubmittedSuccess(false), 8000)
    } catch (err) {
      setError(err.message || 'Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="comments-section" id="comments">
      <div className="comments-header">
        <div className="comments-title-wrap">
          <MessageSquare size={20} className="comments-icon" />
          <h3>Discussion ({comments.length})</h3>
        </div>
        <p className="comments-sub">
          Share your professional perspective or questions regarding this topic.
        </p>
      </div>

      {/* Moderation policy notice */}
      <div className="moderation-notice">
        <ShieldCheck size={16} />
        <span>
          <strong>Editorial Moderation:</strong> To maintain professional standards, all submitted comments are reviewed before appearing publicly.
        </span>
      </div>

      {/* Comment submission form */}
      <form className="comment-form" onSubmit={handleSubmit}>
        <h4>Leave a Comment</h4>

        {submittedSuccess && (
          <div className="form-success">
            <Check size={16} />
            <span>Thank you! Your comment has been submitted and is pending moderation approval.</span>
          </div>
        )}

        {error && <div className="form-error">{error}</div>}

        <div className="form-row">
          <label>
            Your Name / Designation *
            <input
              type="text"
              required
              maxLength={60}
              placeholder="e.g. Rahul Sharma, Finance Director"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              disabled={submitting}
            />
          </label>
        </div>

        <label>
          Comment / Query *
          <textarea
            required
            rows={4}
            maxLength={1500}
            placeholder="Write your observation, question, or professional feedback..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
          />
        </label>

        <div className="form-actions">
          <small className="char-count">{content.length} / 1500 characters</small>
          <button type="submit" className="button primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Post Comment'} <Send size={14} />
          </button>
        </div>
      </form>

      {/* Existing Approved Comments List */}
      <div className="comments-list">
        {loading ? (
          <div className="loading-state">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="empty-comments">
            <p>No comments published yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar">
                <User size={16} />
              </div>
              <div className="comment-body">
                <div className="comment-meta">
                  <strong>{comment.author_name}</strong>
                  <time dateTime={comment.created_at}>
                    {new Date(comment.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
                {/* Safe rendering: React natively escapes text, preventing XSS */}
                <p className="comment-text">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

