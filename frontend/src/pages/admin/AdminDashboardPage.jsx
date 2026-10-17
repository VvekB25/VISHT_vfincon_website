import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle,
  Clock,
  FileEdit,
  FileText,
  MessageSquare,
  Plus,
  ShieldAlert,
} from 'lucide-react'
import { getAdminStats } from '../../lib/supabase'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    publishedNotifs: 0,
    publishedPosts: 0,
    draftPosts: 0,
    pendingComments: 0,
    recentNotifications: [],
    recentPosts: [],
    recentComments: [],
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    getAdminStats()
      .then((data) => {
        if (mounted) setStats(data)
      })
      .catch((err) => console.error('Failed to load admin stats:', err))
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Content Management Dashboard</h1>
          <p>Monitor publication stats, incoming discussion comments, and recent updates.</p>
        </div>
        <div className="admin-header-actions">
          <Link to="/admin/notifications" className="button secondary">
            <Bell size={15} /> Manage Notifications
          </Link>
          <Link to="/admin/blog" className="button primary">
            <Plus size={15} /> New Publication
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon notif-color">
            <Bell size={22} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Published Notifications</span>
            <strong className="stat-value">{loading ? '...' : stats.publishedNotifs}</strong>
            <span className="stat-sub">Live regulatory circulars</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blog-color">
            <FileText size={22} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Published Articles</span>
            <strong className="stat-value">{loading ? '...' : stats.publishedPosts}</strong>
            <span className="stat-sub">Public knowledge base</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon draft-color">
            <FileEdit size={22} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Draft Articles</span>
            <strong className="stat-value">{loading ? '...' : stats.draftPosts}</strong>
            <span className="stat-sub">Unpublished drafts</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon comment-color">
            <MessageSquare size={22} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Pending Comments</span>
            <strong className="stat-value">{loading ? '...' : stats.pendingComments}</strong>
            <span className="stat-sub">Awaiting moderation</span>
          </div>
        </div>
      </div>

      {/* Pending Moderation Callout if comments pending */}
      {stats.pendingComments > 0 && (
        <div className="moderation-alert-card">
          <div className="alert-content">
            <ShieldAlert size={22} className="alert-icon" />
            <div>
              <h4>{stats.pendingComments} Pending Visitor {stats.pendingComments === 1 ? 'Comment' : 'Comments'}</h4>
              <p>New visitor comments require administrator review before becoming visible on published articles.</p>
            </div>
          </div>
          <Link to="/admin/comments" className="button primary">
            Review Comments <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Recent Activity Sections */}
      <div className="dashboard-grid-2">
        {/* Recent Notifications */}
        <div className="dash-panel">
          <div className="panel-header">
            <h3>Recent Notifications</h3>
            <Link to="/admin/notifications" className="text-link">
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <div className="panel-list">
            {stats.recentNotifications.length === 0 ? (
              <p className="empty-panel-text">No notifications created yet.</p>
            ) : (
              stats.recentNotifications.map((notif) => (
                <div key={notif.id} className="panel-item">
                  <div className="panel-item-left">
                    <span className={`status-pill ${notif.status}`}>{notif.status}</span>
                    <span className="cat-badge-sm">{notif.category}</span>
                  </div>
                  <strong className="panel-item-title">{notif.title}</strong>
                  <small className="panel-item-date">
                    {new Date(notif.published_at || notif.created_at).toLocaleDateString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="dash-panel">
          <div className="panel-header">
            <h3>Recent Blog Publications</h3>
            <Link to="/admin/blog" className="text-link">
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <div className="panel-list">
            {stats.recentPosts.length === 0 ? (
              <p className="empty-panel-text">No articles created yet.</p>
            ) : (
              stats.recentPosts.map((post) => (
                <div key={post.id} className="panel-item">
                  <div className="panel-item-left">
                    <span className={`status-pill ${post.status}`}>{post.status}</span>
                    <span className="cat-badge-sm">{post.category}</span>
                  </div>
                  <strong className="panel-item-title">{post.title}</strong>
                  <small className="panel-item-date">
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

