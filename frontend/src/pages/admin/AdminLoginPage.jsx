import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import { adminSignIn, isSupabaseConfigured } from '../../lib/supabase'

import { brand } from '../../config/brand'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await adminSignIn(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials. Please check and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="brand login-brand" aria-label="Back to home">
            <img src={brand.logoPath} alt={brand.fullName} className="brand-logo-img login-logo" />
            <div>
              <strong>{brand.fullName}</strong>
              <small>{brand.shortName} • Admin Portal</small>
            </div>
          </Link>
          <h2>Administrator Sign In</h2>
          <p>Secure content management system for regulatory updates and publications.</p>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {!isSupabaseConfigured ? (
          <div className="form-error" role="status">
            Administrator sign-in is unavailable right now. Please contact the site administrator.
          </div>
        ) : <form onSubmit={handleSubmit} className="login-form">
          <label>
            Admin Email Address
            <input
              type="email"
              required
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="button primary login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'} <ArrowRight size={16} />
          </button>
        </form>}

        <div className="login-security-notice">
          <ShieldCheck size={16} />
          <div>
            <strong>Authorized access only</strong>
            <p>Only authenticated accounts with administrator access can use content management.</p>
          </div>
        </div>

        <div className="login-footer">
          <Link to="/" className="text-link">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  )
}

