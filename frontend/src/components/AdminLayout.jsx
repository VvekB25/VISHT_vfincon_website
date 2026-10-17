import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Bell,
  Database,
  ExternalLink,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react'
import { adminSignOut, getAdminSession, isSupabaseConfigured } from '../lib/supabase'

import { brand } from '../config/brand'

export default function AdminLayout() {
  const [adminUser, setAdminUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getAdminSession().then((session) => {
      if (session) setAdminUser(session.user)
    })
  }, [])

  const handleSignOut = async () => {
    try {
      await adminSignOut()
      navigate('/admin/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Blog Articles', path: '/admin/blog', icon: FileText },
    { label: 'Comments Moderation', path: '/admin/comments', icon: MessageSquare },
  ]

  return (
    <div className="admin-app">
      {/* Mobile Top Header */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            type="button"
            className="admin-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle admin navigation"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/admin/dashboard" className="brand" aria-label="Admin Dashboard">
            <img src={brand.logoPath} alt={brand.fullName} className="brand-logo-img admin-header-logo" />
            <div className="brand-text-desktop">
              <strong>{brand.fullName}</strong>
              <small>{brand.shortName} • Admin Portal</small>
            </div>
            <div className="brand-text-mobile">
              <strong>{brand.shortName}</strong>
            </div>
          </Link>
        </div>

        <div className="admin-topbar-right">
          <div className="admin-user-pill">
            <ShieldCheck size={14} className="user-icon" />
            <span className="user-email">{adminUser?.email || 'Administrator'}</span>
          </div>
          <button type="button" onClick={handleSignOut} className="admin-logout-btn" title="Sign Out">
            <LogOut size={16} />
            <span className="hide-sm">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Backend Status Notification Strip */}
      <div className={`db-status-bar ${isSupabaseConfigured ? 'connected' : 'local-mode'}`}>
        <div className="container status-inner">
          {isSupabaseConfigured ? (
            <span>
              <Database size={13} /> <strong>Live Supabase Backend Connected:</strong> Real-time PostgreSQL database & Row Level Security active.
            </span>
          ) : (
            <span>
              <ShieldAlert size={13} /> <strong>Local Storage Testing Mode:</strong> Live Supabase credentials not found in <code>.env</code>. Data persists locally in browser storage. Copy <code>.env.example</code> to <code>.env</code> with your Supabase credentials when ready.
            </span>
          )}
        </div>
      </div>

      <div className="admin-body">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-section">
            <span className="sidebar-heading">Content Management</span>
            <nav className="admin-nav">
              {navItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/admin/dashboard'}
                  className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="sidebar-footer">
            <Link to="/" className="admin-nav-item public-site-link" target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              <span>View Public Website</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-content">
          <div className="admin-content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

