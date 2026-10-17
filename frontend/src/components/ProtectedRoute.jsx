import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getAdminSession } from '../lib/supabase'

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const location = useLocation()

  useEffect(() => {
    let mounted = true
    const checkAuth = async () => {
      try {
        const currentSession = await getAdminSession()
        if (mounted) setSession(currentSession)
      } catch {
        if (mounted) setSession(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    checkAuth()
    return () => {
      mounted = false
    }
  }, [location.pathname])

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="spinner"></div>
        <p>Verifying administrator session...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

