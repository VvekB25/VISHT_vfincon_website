import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  ExternalLink,
  FileCheck2,
  FileDown,
  Info,
  ShieldAlert,
} from 'lucide-react'
import { getNotificationBySlug } from '../lib/supabase'
import { brand } from '../config/brand'
import CTASection from '../components/CTASection'

export default function NotificationDetailPage() {
  const { slug } = useParams()
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchItem = async () => {
      try {
        setLoading(true)
        const data = await getNotificationBySlug(slug)
        if (mounted) setNotification(data)
      } catch (err) {
        console.error('Error fetching notification:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchItem()
    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <main className="detail-loading-container container">
        <div className="skeleton-bar short"></div>
        <div className="skeleton-bar title" style={{ height: '36px', margin: '20px 0' }}></div>
        <div className="skeleton-bar full"></div>
        <div className="skeleton-bar full"></div>
      </main>
    )
  }

  if (!notification || notification.status !== 'published') {
    return (
      <main className="container not-found-page">
        <AlertCircle size={48} className="empty-icon" />
        <h2>Notification Not Found</h2>
        <p>The regulatory notification or advisory you requested could not be found or is no longer published.</p>
        <Link to="/notifications" className="button primary">
          <ArrowLeft size={16} /> Return to Notifications
        </Link>
      </main>
    )
  }

  const {
    title,
    summary,
    content,
    category,
    published_at,
    expires_at,
    source_name,
    source_url,
    attachment_url,
  } = notification

  const formattedDate = new Date(published_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const isExpired = expires_at && new Date(expires_at).getTime() < Date.now()

  return (
    <main>
      {/* Breadcrumb strip */}
      <div className="breadcrumb-strip">
        <div className="container">
          <Link to="/notifications" className="back-link">
            <ArrowLeft size={15} /> All Notifications
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{category}</span>
        </div>
      </div>

      <article className="section detail-section">
        <div className="container detail-container">
          {/* Header */}
          <header className="detail-header">
            <div className="detail-meta">
              <span className={`cat-badge cat-${(category || 'general').toLowerCase().replace(/[^a-z]/g, '')}`}>
                {category}
              </span>
              <span className="notif-date">
                <Calendar size={14} /> Published on {formattedDate}
              </span>
              {isExpired && (
                <span className="expired-badge">
                  <ShieldAlert size={14} /> Expired Advisory
                </span>
              )}
            </div>

            <h1 className="detail-title">{title}</h1>

            <div className="summary-callout">
              <Info size={20} className="summary-icon" />
              <div>
                <strong>Executive Summary:</strong>
                <p>{summary}</p>
              </div>
            </div>
          </header>

          {/* Official Gazette Source Box */}
          <div className="official-source-box">
            <div className="source-box-left">
              <span className="source-badge">
                <FileCheck2 size={16} /> Official Gazette / Regulatory Reference
              </span>
              <h4>{source_name}</h4>
              <p>
                To examine the original gazette circular, statutory notification, or official orders, consult the statutory source directly.
              </p>
            </div>
            <div className="source-box-actions">
              {source_url && (
                <a
                  href={source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button secondary"
                >
                  Visit Official Source <ExternalLink size={14} />
                </a>
              )}
              {attachment_url && (
                <a
                  href={attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button secondary"
                >
                  <FileDown size={14} /> Download Gazette PDF
                </a>
              )}
            </div>
          </div>

          {/* VFINCON Professional Analysis Body */}
          <div className="analysis-box">
            <div className="analysis-watermark">
              <img src={brand.faviconPath} alt={brand.fullName} className="analysis-brand-logo" />
              <span className="analysis-label">{brand.fullName} ({brand.shortName}) Advisory Desk</span>
            </div>

            <div className="detail-body">
              {content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Statutory Editorial Disclaimer */}
          <div className="disclaimer-banner">
            <AlertCircle size={18} />
            <p>
              <strong>Disclaimer:</strong> This summary, breakdown, and commentary is prepared by the {brand.fullName} professional advisory team for educational and informational purposes. It does not constitute official statutory text or direct legal opinion. For official verification and compliance execution, please refer to the primary government gazette or consult our advisory desk.
            </p>
          </div>

          {/* Actions & Navigation */}
          <div className="detail-bottom-actions">
            <Link to="/notifications" className="button secondary">
              <ArrowLeft size={16} /> Back to All Notifications
            </Link>
            <Link to="/contact" className="button primary">
              Seek Clarification for Your Business
            </Link>
          </div>
        </div>
      </article>

      <CTASection />
    </main>
  )
}

