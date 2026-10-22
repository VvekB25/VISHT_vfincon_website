import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  Tag,
  User,
} from 'lucide-react'
import CommentSection from '../components/CommentSection'
import ShareButton from '../components/ShareButton'
import {
  getBlogPostBySlug,
  getPostLikes,
  getVisitorId,
  togglePostLike,
} from '../lib/supabase'
import CTASection from '../components/CTASection'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [likesCount, setLikesCount] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const data = await getBlogPostBySlug(slug)
        if (mounted && data) {
          setPost(data)
          // Fetch likes with visitor ID
          const vid = getVisitorId()
          const likesInfo = await getPostLikes(data.id, vid)
          if (mounted) {
            setLikesCount(likesInfo.count)
            setHasLiked(likesInfo.hasLiked)
          }
        }
      } catch (err) {
        console.error('Error loading blog article:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchArticle()
    return () => {
      mounted = false
    }
  }, [slug])

  const handleLikeToggle = async () => {
    if (!post || liking) return
    try {
      setLiking(true)
      const vid = getVisitorId()
      const updated = await togglePostLike(post.id, vid)
      setLikesCount(updated.count)
      setHasLiked(updated.hasLiked)
    } catch (err) {
      console.error('Like toggle failed:', err)
    } finally {
      setLiking(false)
    }
  }

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

  if (!post || post.status !== 'published') {
    return (
      <main className="container not-found-page">
        <AlertCircle size={48} className="empty-icon" />
        <h2>Article Not Found</h2>
        <p>The requested publication could not be found or has not been published yet.</p>
        <Link to="/blog" className="button primary">
          <ArrowLeft size={16} /> Return to Blog
        </Link>
      </main>
    )
  }

  const {
    id,
    title,
    excerpt,
    content,
    category,
    tags,
    author_name,
    published_at,
    featured_image,
  } = post

  const formattedDate = new Date(published_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const wordCount = (content || '').split(/\s+/).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <main>
      {/* Breadcrumb strip */}
      <div className="breadcrumb-strip">
        <div className="container">
          <Link to="/blog" className="back-link">
            <ArrowLeft size={15} /> All Articles
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{category}</span>
        </div>
      </div>

      <article className="section article-detail-section">
        <div className="container article-container">
          {/* Article Header */}
          <header className="article-header">
            <span className="cat-badge">{category}</span>
            <h1 className="article-title">{title}</h1>
            <p className="article-lead">{excerpt}</p>

            <div className="article-meta-row">
              <div className="article-author-block">
                <span className="author-avatar"><User size={16} /></span>
                <div>
                  <strong>{author_name || 'VFINCON Advisory Desk'}</strong>
                  <div className="author-meta-sub">
                    <span><Calendar size={13} /> {formattedDate}</span>
                    <span>•</span>
                    <span><Clock size={13} /> {readTime} min read</span>
                  </div>
                </div>
              </div>

              {/* Top Interaction Buttons: Like & Share */}
              <div className="article-actions-bar">
                <button
                  type="button"
                  className={`like-button ${hasLiked ? 'liked' : ''}`}
                  onClick={handleLikeToggle}
                  disabled={liking}
                  aria-label={hasLiked ? 'Unlike article' : 'Like article'}
                >
                  <Heart size={16} className={hasLiked ? 'heart-filled' : ''} />
                  <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                </button>

                <ShareButton title={title} text={excerpt} />
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {featured_image && (
            <div className="article-featured-image-wrap">
              <img src={featured_image} alt={title} />
            </div>
          )}

          {/* Article Body */}
          <div className="article-body">
            {content.split('\n\n').map((block, i) => {
              if (block.startsWith('### ')) {
                return <h3 key={i}>{block.replace('### ', '')}</h3>
              }
              if (block.startsWith('## ')) {
                return <h2 key={i}>{block.replace('## ', '')}</h2>
              }
              if (block.startsWith('- ')) {
                const items = block.split('\n- ')
                return (
                  <ul key={i}>
                    {items.map((it, idx) => (
                      <li key={idx}>{it.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                )
              }
              return <p key={i}>{block}</p>
            })}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="article-tags-wrap">
              <span className="tags-label"><Tag size={14} /> Topic Tags:</span>
              <div className="tags-list">
                {(Array.isArray(tags) ? tags : tags.split(',')).map((t, idx) => (
                  <span key={idx} className="tag-pill">
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Interaction & Engagement Bar */}
          <div className="article-engagement-bar">
            <div className="engagement-left">
              <button
                type="button"
                className={`like-button large ${hasLiked ? 'liked' : ''}`}
                onClick={handleLikeToggle}
                disabled={liking}
              >
                <Heart size={18} className={hasLiked ? 'heart-filled' : ''} />
                <span>{hasLiked ? 'Liked' : 'Helpful Article'} ({likesCount})</span>
              </button>
            </div>
            <div className="engagement-right">
              <ShareButton title={title} text={excerpt} />
            </div>
          </div>

          {/* Comment Section (Moderated) */}
          <CommentSection postId={id} postTitle={title} />
        </div>
      </article>

      <CTASection />
    </main>
  )
}

