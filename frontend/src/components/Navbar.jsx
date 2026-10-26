import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Menu, ShieldCheck, X } from 'lucide-react'
import { getAdminSession } from '../lib/supabase'

import { brand } from '../config/brand'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [adminSession, setAdminSession] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    const checkAuth = async () => {
      try {
        const session = await getAdminSession()
        if (mounted) setAdminSession(session)
      } catch {
        if (mounted) setAdminSession(null)
      }
    }
    checkAuth()

    const onAuthChange = () => checkAuth()
    window.addEventListener('authstatechange', onAuthChange)
    return () => {
      mounted = false
      window.removeEventListener('authstatechange', onAuthChange)
    }
  }, [location.pathname])

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
     { label: 'About', path: '/about' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link to="/" className="brand" aria-label={`${brand.fullName} homepage`}>
          <img
            src={brand.logoPath}
            alt={brand.fullName}
            className="brand-logo-img"
          />
          <div className="brand-text-desktop">
            <strong>{brand.fullName}</strong>
            <small>{brand.shortName} • Professional Advisory</small>
          </div>
          <div className="brand-text-mobile">
            <strong>{brand.shortName}</strong>
          </div>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav className={open ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
          {links.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={isActive(path) ? 'nav-link active' : 'nav-link'}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}

          {adminSession ? (
            <Link
              to="/admin/dashboard"
              className={location.pathname.startsWith('/admin') ? 'nav-link admin-pill active' : 'nav-link admin-pill'}
              onClick={() => setOpen(false)}
            >
              <ShieldCheck size={14} /> Admin
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className={location.pathname === '/admin/login' ? 'nav-link admin-link active' : 'nav-link admin-link'}
              onClick={() => setOpen(false)}
            >
              <Lock size={13} /> Admin Login
            </Link>
          )}

          <button
            className="nav-cta"
            onClick={() => {
              navigate('/contact')
              setOpen(false)
            }}
          >
            Book a Consultation <ArrowRight size={15} />
          </button>
        </nav>
      </div>
    </header>
  )
}

