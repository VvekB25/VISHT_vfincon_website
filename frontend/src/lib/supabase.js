import { createClient } from '@supabase/supabase-js'
import { initialBlogPosts, initialComments, initialNotifications } from './seedData'

const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  envUrl &&
  envKey &&
  envUrl !== 'https://your-project-id.supabase.co' &&
  !envUrl.includes('your-project-id')
)

export const supabase = isSupabaseConfigured
  ? createClient(envUrl, envKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

// --- Local Storage Fallback Store (Used when Supabase is not configured yet) ---
const STORAGE_KEYS = {
  NOTIFICATIONS: 'vfincon_notifications_v1',
  BLOG: 'vfincon_blog_v1',
  COMMENTS: 'vfincon_comments_v1',
  LIKES: 'vfincon_likes_v1',
  ADMIN_SESSION: 'vfincon_admin_session_v1',
}

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error('LocalStorage write failed:', err)
  }
}

// Ensure initial seed data exists in LocalStorage
if (!isSupabaseConfigured) {
  getStored(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
  getStored(STORAGE_KEYS.BLOG, initialBlogPosts)
  getStored(STORAGE_KEYS.COMMENTS, initialComments)
  getStored(STORAGE_KEYS.LIKES, {})
}

// ==============================================================================
// 1. AUTHENTICATION HELPERS
// ==============================================================================
export async function getAdminSession() {
  if (isSupabaseConfigured && supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      return {
        user: {
          id: session.user.id,
          email: session.user.email,
          role: 'admin',
        },
      }
    }
    return null
  }

  // Local storage session
  const stored = getStored(STORAGE_KEYS.ADMIN_SESSION, null)
  return stored
}

export async function adminSignIn(email, password) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  // Local Storage Demo Login
  // Allows testing when Supabase credentials are not yet supplied
  if (email && password) {
    const session = {
      user: {
        id: 'local-admin-uuid',
        email,
        role: 'admin',
        full_name: 'Vidmahi Fin Consultants Administrator',
      },
      token: 'demo-local-jwt',
      expires_at: Date.now() + 86400000,
    }
    setStored(STORAGE_KEYS.ADMIN_SESSION, session)
    window.dispatchEvent(new Event('authstatechange'))
    return session
  }
  throw new Error('Please enter a valid email and password')
}

export async function adminSignOut() {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut()
    return
  }
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION)
  window.dispatchEvent(new Event('authstatechange'))
}

// ==============================================================================
// 2. NOTIFICATIONS API
// ==============================================================================
export async function getNotifications({ category = 'All', search = '', status = 'published', includeExpired = false } = {}) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('published_at', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    if (!includeExpired && status === 'published') {
      const now = new Date().toISOString()
      query = query.or(`expires_at.is.null,expires_at.gt.${now}`)
    }

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`
      query = query.or(`title.ilike.${term},summary.ilike.${term},content.ilike.${term}`)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Fallback Local Storage
  const items = getStored(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
  const now = Date.now()

  return items.filter(item => {
    if (status !== 'all' && item.status !== status) return false
    if (!includeExpired && item.status === 'published' && item.expires_at) {
      if (new Date(item.expires_at).getTime() < now) return false
    }
    if (category && category !== 'All' && item.category !== category) return false
    if (search && search.trim()) {
      const q = search.toLowerCase()
      const match =
        item.title?.toLowerCase().includes(q) ||
        item.summary?.toLowerCase().includes(q) ||
        item.content?.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  }).sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at))
}

export async function getNotificationBySlug(slug) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) return null
    return data
  }

  const items = getStored(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
  return items.find(n => n.slug === slug) || null
}

export async function createNotification(payload) {
  const cleanData = {
    ...payload,
    slug: payload.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([cleanData])
      .select()
      .single()
    if (error) throw error
    return data
  }

  const items = getStored(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
  if (items.some(n => n.slug === cleanData.slug)) {
    throw new Error('A notification with this URL slug already exists. Please choose a unique slug.')
  }
  const newItem = {
    ...cleanData,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
  }
  setStored(STORAGE_KEYS.NOTIFICATIONS, [newItem, ...items])
  return newItem
}

export async function updateNotification(id, payload) {
  const cleanData = {
    ...payload,
    slug: payload.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('notifications')
      .update(cleanData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  const items = getStored(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
  const index = items.findIndex(n => n.id === id)
  if (index === -1) throw new Error('Notification not found')

  if (items.some(n => n.slug === cleanData.slug && n.id !== id)) {
    throw new Error('Another notification is already using this URL slug.')
  }

  const updated = { ...items[index], ...cleanData }
  items[index] = updated
  setStored(STORAGE_KEYS.NOTIFICATIONS, items)
  return updated
}

export async function deleteNotification(id) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('notifications').delete().eq('id', id)
    if (error) throw error
    return true
  }

  const items = getStored(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
  const filtered = items.filter(n => n.id !== id)
  setStored(STORAGE_KEYS.NOTIFICATIONS, filtered)
  return true
}

// ==============================================================================
// 3. BLOG POSTS API
// ==============================================================================
export async function getBlogPosts({ category = 'All', search = '', status = 'published' } = {}) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`
      query = query.or(`title.ilike.${term},excerpt.ilike.${term},content.ilike.${term}`)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  const items = getStored(STORAGE_KEYS.BLOG, initialBlogPosts)
  return items.filter(post => {
    if (status !== 'all' && post.status !== status) return false
    if (category && category !== 'All' && post.category !== category) return false
    if (search && search.trim()) {
      const q = search.toLowerCase()
      const match =
        post.title?.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        post.content?.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  }).sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at))
}

export async function getBlogPostBySlug(slug) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) return null
    return data
  }

  const items = getStored(STORAGE_KEYS.BLOG, initialBlogPosts)
  return items.find(p => p.slug === slug) || null
}

export async function createBlogPost(payload) {
  const cleanData = {
    ...payload,
    slug: payload.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([cleanData])
      .select()
      .single()
    if (error) throw error
    return data
  }

  const items = getStored(STORAGE_KEYS.BLOG, initialBlogPosts)
  if (items.some(p => p.slug === cleanData.slug)) {
    throw new Error('An article with this URL slug already exists. Please choose a unique slug.')
  }
  const newPost = {
    ...cleanData,
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
  }
  setStored(STORAGE_KEYS.BLOG, [newPost, ...items])
  return newPost
}

export async function updateBlogPost(id, payload) {
  const cleanData = {
    ...payload,
    slug: payload.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(cleanData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  const items = getStored(STORAGE_KEYS.BLOG, initialBlogPosts)
  const index = items.findIndex(p => p.id === id)
  if (index === -1) throw new Error('Blog post not found')

  if (items.some(p => p.slug === cleanData.slug && p.id !== id)) {
    throw new Error('Another article is already using this URL slug.')
  }

  const updated = { ...items[index], ...cleanData }
  items[index] = updated
  setStored(STORAGE_KEYS.BLOG, items)
  return updated
}

export async function deleteBlogPost(id) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) throw error
    return true
  }

  const items = getStored(STORAGE_KEYS.BLOG, initialBlogPosts)
  const filtered = items.filter(p => p.id !== id)
  setStored(STORAGE_KEYS.BLOG, filtered)
  return true
}

// ==============================================================================
// 4. COMMENTS & MODERATION API
// ==============================================================================
export async function getPostComments(postId, status = 'approved') {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  const comments = getStored(STORAGE_KEYS.COMMENTS, initialComments)
  return comments
    .filter(c => c.post_id === postId && (status === 'all' || c.status === status))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
}

export async function getAllComments({ status = 'all' } = {}) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('comments')
      .select('*, blog_posts(title, slug)')
      .order('created_at', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  const comments = getStored(STORAGE_KEYS.COMMENTS, initialComments)
  const posts = getStored(STORAGE_KEYS.BLOG, initialBlogPosts)
  const postMap = Object.fromEntries(posts.map(p => [p.id, { title: p.title, slug: p.slug }]))

  return comments
    .filter(c => status === 'all' || c.status === status)
    .map(c => ({
      ...c,
      blog_posts: postMap[c.post_id] || { title: 'Unknown Article', slug: '' },
    }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export async function submitComment({ postId, authorName, content }) {
  const trimmedName = (authorName || '').trim()
  const trimmedContent = (content || '').trim()

  if (trimmedName.length < 2 || trimmedName.length > 60) {
    throw new Error('Please enter a display name between 2 and 60 characters.')
  }
  if (trimmedContent.length < 3 || trimmedContent.length > 1500) {
    throw new Error('Comment must be between 3 and 1500 characters.')
  }

  const newComment = {
    post_id: postId,
    author_name: trimmedName,
    content: trimmedContent,
    status: 'pending', // Strictly submitted for moderation
    created_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('comments')
      .insert([newComment])
      .select()
      .single()
    if (error) throw error
    return data
  }

  const comments = getStored(STORAGE_KEYS.COMMENTS, initialComments)
  const created = {
    ...newComment,
    id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  }
  setStored(STORAGE_KEYS.COMMENTS, [...comments, created])
  return created
}

export async function updateCommentStatus(commentId, status) {
  if (!['approved', 'rejected', 'removed', 'pending'].includes(status)) {
    throw new Error('Invalid comment status.')
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('comments')
      .update({ status })
      .eq('id', commentId)
      .select()
      .single()
    if (error) throw error
    return data
  }

  const comments = getStored(STORAGE_KEYS.COMMENTS, initialComments)
  const index = comments.findIndex(c => c.id === commentId)
  if (index === -1) throw new Error('Comment not found')

  comments[index].status = status
  setStored(STORAGE_KEYS.COMMENTS, comments)
  return comments[index]
}

export async function deleteComment(commentId) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('comments').delete().eq('id', commentId)
    if (error) throw error
    return true
  }

  const comments = getStored(STORAGE_KEYS.COMMENTS, initialComments)
  const filtered = comments.filter(c => c.id !== commentId)
  setStored(STORAGE_KEYS.COMMENTS, filtered)
  return true
}

// ==============================================================================
// 5. LIKES & VISITOR INTERACTIONS
// ==============================================================================
export function getVisitorId() {
  let vid = localStorage.getItem('vfincon_vid')
  if (!vid) {
    vid = 'vid_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36)
    localStorage.setItem('vfincon_vid', vid)
  }
  return vid
}

export async function getPostLikes(postId, visitorId) {
  if (isSupabaseConfigured && supabase) {
    const { data, count, error } = await supabase
      .from('post_likes')
      .select('visitor_id', { count: 'exact' })
      .eq('post_id', postId)

    if (error) throw error
    const hasLiked = visitorId ? (data || []).some(l => l.visitor_id === visitorId) : false
    return { count: count || 0, hasLiked }
  }

  const likesMap = getStored(STORAGE_KEYS.LIKES, {})
  const postLikes = likesMap[postId] || []
  return {
    count: postLikes.length,
    hasLiked: visitorId ? postLikes.includes(visitorId) : false,
  }
}

export async function togglePostLike(postId, visitorId) {
  if (!visitorId) return { count: 0, hasLiked: false }

  if (isSupabaseConfigured && supabase) {
    // Check if like exists
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('visitor_id', visitorId)
      .maybeSingle()

    if (existing) {
      // Remove like
      await supabase.from('post_likes').delete().eq('id', existing.id)
    } else {
      // Add like
      await supabase.from('post_likes').insert([{ post_id: postId, visitor_id: visitorId }])
    }

    return await getPostLikes(postId, visitorId)
  }

  const likesMap = getStored(STORAGE_KEYS.LIKES, {})
  let postLikes = likesMap[postId] || []

  if (postLikes.includes(visitorId)) {
    postLikes = postLikes.filter(id => id !== visitorId)
  } else {
    postLikes.push(visitorId)
  }

  likesMap[postId] = postLikes
  setStored(STORAGE_KEYS.LIKES, likesMap)
  return {
    count: postLikes.length,
    hasLiked: postLikes.includes(visitorId),
  }
}

// ==============================================================================
// 6. ADMIN DASHBOARD STATS
// ==============================================================================
export async function getAdminStats() {
  const notifs = await getNotifications({ status: 'all', includeExpired: true })
  const posts = await getBlogPosts({ status: 'all' })
  const comments = await getAllComments({ status: 'all' })

  const publishedNotifs = notifs.filter(n => n.status === 'published').length
  const publishedPosts = posts.filter(p => p.status === 'published').length
  const draftPosts = posts.filter(p => p.status === 'draft').length
  const pendingComments = comments.filter(c => c.status === 'pending').length

  return {
    publishedNotifs,
    publishedPosts,
    draftPosts,
    pendingComments,
    recentNotifications: notifs.slice(0, 4),
    recentPosts: posts.slice(0, 4),
    recentComments: comments.slice(0, 4),
  }
}

