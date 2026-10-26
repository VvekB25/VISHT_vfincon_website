import { createClient } from '@supabase/supabase-js'

const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function isPublicSupabaseKey(key) {
  if (!key || key.startsWith('sb_secret_') || /service[_-]?role/i.test(key)) return false
  try {
    const payload = JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.role !== 'service_role'
  } catch {
    return key.startsWith('sb_publishable_')
  }
}

export const isSupabaseConfigured = Boolean(envUrl && envKey && isPublicSupabaseKey(envKey) && /^https:\/\//i.test(envUrl))

export const supabase = isSupabaseConfigured
  ? createClient(envUrl, envKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

const SERVICE_UNAVAILABLE = 'This feature is temporarily unavailable. Please try again later.'
const REQUEST_FAILED = 'Unable to complete the request. Please try again.'

function requireSupabase() {
  if (!supabase || !isSupabaseConfigured) throw new Error(SERVICE_UNAVAILABLE)
  return supabase
}

function sanitizeSearch(value) {
  return String(value || '').trim().slice(0, 100).replace(/[(),.%_\\]/g, ' ')
}

function normalizeSlug(value) {
  return String(value || '').trim().toLowerCase().slice(0, 180).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function asSafeError(error) {
  if (error instanceof Error && error.message === SERVICE_UNAVAILABLE) return error
  return new Error(REQUEST_FAILED)
}

async function requireAuthorizedAdmin() {
  const client = requireSupabase()
  if (!(await getAdminSession())) throw new Error('Administrator access is required.')
  return client
}

// ==============================================================================
// 1. AUTHENTICATION HELPERS
// ==============================================================================
export async function getAdminSession() {
  if (!supabase || !isSupabaseConfigured) return null
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user?.id) return null
    const { data: profile, error } = await supabase
      .from('profiles').select('id, role, full_name').eq('id', session.user.id).maybeSingle()
    if (error || !profile || !['admin', 'editor'].includes(profile.role)) return null
    return { user: { id: session.user.id, email: session.user.email, role: profile.role, full_name: profile.full_name } }
  } catch {
    return null
  }
}

export async function adminSignIn(email, password) {
  const client = requireSupabase()
  try {
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) throw error
    const authorized = await getAdminSession()
    if (!authorized) {
      await client.auth.signOut()
      throw new Error('unauthorized')
    }
    window.dispatchEvent(new Event('authstatechange'))
    return authorized
  } catch {
    throw new Error('Sign-in failed or this account is not authorized.')
  }
}

export async function adminSignOut() {
  if (supabase) await supabase.auth.signOut().catch(() => {})
  try { localStorage.removeItem('vfincon_admin_session_v1') } catch { /* Storage can be unavailable in private contexts. */ }
  window.dispatchEvent(new Event('authstatechange'))
}

// Public reads rely on database Row Level Security. If configuration is absent,
// return empty public content and keep administrative writes disabled.
export async function getNotifications({ category = 'All', search = '', status = 'published', includeExpired = false } = {}) {
  if (!supabase || !isSupabaseConfigured) return []
  try {
    let query = supabase.from('notifications').select('*').order('published_at', { ascending: false })
    if (status !== 'all') query = query.eq('status', status)
    if (!includeExpired && status === 'published') query = query.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
    if (category && category !== 'All') query = query.eq('category', category)
    const term = sanitizeSearch(search)
    if (term) query = query.or('title.ilike.%' + term + '%,summary.ilike.%' + term + '%,content.ilike.%' + term + '%')
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) { throw asSafeError(error) }
}

export async function getNotificationBySlug(slug) {
  if (!supabase || !isSupabaseConfigured || !slug) return null
  try {
    const { data, error } = await supabase.from('notifications').select('*').eq('slug', String(slug).slice(0, 180)).maybeSingle()
    if (error) throw error
    return data
  } catch (error) { throw asSafeError(error) }
}

export async function createNotification(payload) {
  const client = await requireAuthorizedAdmin()
  const cleanData = { ...payload, slug: normalizeSlug(payload.slug), updated_at: new Date().toISOString() }
  try {
    const { data, error } = await client.from('notifications').insert([cleanData]).select().single()
    if (error) throw error
    return data
  } catch (error) { throw asSafeError(error) }
}

export async function updateNotification(id, payload) {
  const client = await requireAuthorizedAdmin()
  const cleanData = { ...payload, slug: normalizeSlug(payload.slug), updated_at: new Date().toISOString() }
  try {
    const { data, error } = await client.from('notifications').update(cleanData).eq('id', id).select().single()
    if (error) throw error
    return data
  } catch (error) { throw asSafeError(error) }
}

export async function deleteNotification(id) {
  const client = await requireAuthorizedAdmin()
  try {
    const { error } = await client.from('notifications').delete().eq('id', id)
    if (error) throw error
    return true
  } catch (error) { throw asSafeError(error) }
}

export async function getBlogPosts({ category = 'All', search = '', status = 'published' } = {}) {
  if (!supabase || !isSupabaseConfigured) return []
  try {
    let query = supabase.from('blog_posts').select('*').order('published_at', { ascending: false })
    if (status !== 'all') query = query.eq('status', status)
    if (category && category !== 'All') query = query.eq('category', category)
    const term = sanitizeSearch(search)
    if (term) query = query.or('title.ilike.%' + term + '%,excerpt.ilike.%' + term + '%,content.ilike.%' + term + '%')
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) { throw asSafeError(error) }
}

export async function getBlogPostBySlug(slug) {
  if (!supabase || !isSupabaseConfigured || !slug) return null
  try {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', String(slug).slice(0, 180)).maybeSingle()
    if (error) throw error
    return data
  } catch (error) { throw asSafeError(error) }
}

export async function createBlogPost(payload) {
  const client = await requireAuthorizedAdmin()
  const cleanData = { ...payload, slug: normalizeSlug(payload.slug), updated_at: new Date().toISOString() }
  try {
    const { data, error } = await client.from('blog_posts').insert([cleanData]).select().single()
    if (error) throw error
    return data
  } catch (error) { throw asSafeError(error) }
}

export async function updateBlogPost(id, payload) {
  const client = await requireAuthorizedAdmin()
  const cleanData = { ...payload, slug: normalizeSlug(payload.slug), updated_at: new Date().toISOString() }
  try {
    const { data, error } = await client.from('blog_posts').update(cleanData).eq('id', id).select().single()
    if (error) throw error
    return data
  } catch (error) { throw asSafeError(error) }
}

export async function deleteBlogPost(id) {
  const client = await requireAuthorizedAdmin()
  try {
    const { error } = await client.from('blog_posts').delete().eq('id', id)
    if (error) throw error
    return true
  } catch (error) { throw asSafeError(error) }
}

export async function getPostComments(postId, status = 'approved') {
  if (!supabase || !isSupabaseConfigured) return []
  try {
    let query = supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true })
    if (status !== 'all') query = query.eq('status', status)
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) { throw asSafeError(error) }
}

export async function getAllComments({ status = 'all' } = {}) {
  const client = await requireAuthorizedAdmin()
  try {
    let query = client.from('comments').select('*, blog_posts(title, slug)').order('created_at', { ascending: false })
    if (status !== 'all') query = query.eq('status', status)
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) { throw asSafeError(error) }
}

export async function submitComment({ postId, authorName, content }) {
  const trimmedName = String(authorName || '').trim()
  const trimmedContent = String(content || '').trim()
  if (!/^[0-9a-f-]{36}$/i.test(String(postId || ''))) throw new Error('Please select a valid article.')
  if (trimmedName.length < 2 || trimmedName.length > 60) throw new Error('Please enter a display name between 2 and 60 characters.')
  if (trimmedContent.length < 3 || trimmedContent.length > 1500) throw new Error('Comment must be between 3 and 1500 characters.')
  const client = requireSupabase()
  try {
    const { data, error } = await client.from('comments').insert([{
      post_id: postId, author_name: trimmedName, content: trimmedContent, status: 'pending',
    }]).select().single()
    if (error) throw error
    return data
  } catch (error) { throw asSafeError(error) }
}

export async function updateCommentStatus(commentId, status) {
  if (!['approved', 'rejected', 'removed', 'pending'].includes(status)) throw new Error('Invalid comment status.')
  const client = await requireAuthorizedAdmin()
  try {
    const { data, error } = await client.from('comments').update({ status }).eq('id', commentId).select().single()
    if (error) throw error
    return data
  } catch (error) { throw asSafeError(error) }
}

export async function deleteComment(commentId) {
  const client = await requireAuthorizedAdmin()
  try {
    const { error } = await client.from('comments').delete().eq('id', commentId)
    if (error) throw error
    return true
  } catch (error) { throw asSafeError(error) }
}

export async function getAdminStats() {
  await requireAuthorizedAdmin()
  const [notifs, posts, comments] = await Promise.all([
    getNotifications({ status: 'all', includeExpired: true }),
    getBlogPosts({ status: 'all' }),
    getAllComments({ status: 'all' }),
  ])
  return {
    publishedNotifs: notifs.filter(item => item.status === 'published').length,
    publishedPosts: posts.filter(item => item.status === 'published').length,
    draftPosts: posts.filter(item => item.status === 'draft').length,
    pendingComments: comments.filter(item => item.status === 'pending').length,
    recentNotifications: notifs.slice(0, 4),
    recentPosts: posts.slice(0, 4),
    recentComments: comments.slice(0, 4),
  }
}
