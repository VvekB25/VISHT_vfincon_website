import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Clock, User } from 'lucide-react'

export default function BlogCard({ post }) {
  const {
    slug,
    title,
    excerpt,
    category,
    author_name,
    published_at,
    featured_image,
    content,
  } = post

  const formattedDate = new Date(published_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  // Calculate approximate read time (200 words per minute)
  const wordCount = (content || '').split(/\s+/).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <article className="blog-card">
      <Link to={`/blog/${slug}`} className="blog-card-media" tabIndex={-1} aria-hidden="true">
        {featured_image ? (
          <img src={featured_image} alt="" loading="lazy" />
        ) : (
          <div className="blog-card-placeholder">
            <span className="brand-mark">V</span>
          </div>
        )}
      </Link>

      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span className="cat-badge">{category}</span>
          <span className="blog-read-time">
            <Clock size={12} /> {readTime} min read
          </span>
        </div>

        <h3 className="blog-card-title">
          <Link to={`/blog/${slug}`}>{title}</Link>
        </h3>

        <p className="blog-card-excerpt">{excerpt}</p>

        <div className="blog-card-footer">
          <div className="blog-author-info">
            <span className="author-icon"><User size={12} /></span>
            <div>
              <strong>{author_name || 'VFINCON Desk'}</strong>
              <small>{formattedDate}</small>
            </div>
          </div>

          <Link to={`/blog/${slug}`} className="text-link">
            Read <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  )
}

