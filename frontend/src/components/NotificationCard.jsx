import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, ExternalLink, ShieldAlert } from 'lucide-react'

export default function NotificationCard({ notification }) {
  const {
    slug,
    title,
    summary,
    category,
    published_at,
    expires_at,
    source_name,
    source_url,
  } = notification

  const formattedDate = new Date(published_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const isExpired = expires_at && new Date(expires_at).getTime() < Date.now()

  return (
    <article className="notif-card">
      <div className="notif-meta">
        <span className={`cat-badge cat-${(category || 'general').toLowerCase().replace(/[^a-z]/g, '')}`}>
          {category}
        </span>
        <span className="notif-date">
          <Calendar size={13} /> {formattedDate}
        </span>
        {isExpired && (
          <span className="expired-badge">
            <ShieldAlert size={12} /> Expired
          </span>
        )}
      </div>

      <h3 className="notif-title">
        <Link to={`/notifications/${slug}`}>{title}</Link>
      </h3>

      <p className="notif-summary">{summary}</p>

      <div className="notif-footer">
        {source_name && (
          <div className="source-tag">
            <small>Source:</small>
            {source_url ? (
              <a
                href={source_url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Official source: ${source_name}`}
                onClick={(e) => e.stopPropagation()}
              >
                {source_name} <ExternalLink size={11} />
              </a>
            ) : (
              <span>{source_name}</span>
            )}
          </div>
        )}

        <Link to={`/notifications/${slug}`} className="text-link notif-read-link">
          Read Advisory <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  )
}

