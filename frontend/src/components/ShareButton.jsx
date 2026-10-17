import { useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'

export default function ShareButton({ title, text, url }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || window.location.href

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || document.title,
          text: text || '',
          url: shareUrl,
        })
        return
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Native share failed, falling back to copy:', err)
        } else {
          return
        }
      }
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback prompt
      window.prompt('Copy article link:', shareUrl)
    }
  }

  return (
    <div className="share-btn-wrap">
      <button
        type="button"
        onClick={handleShare}
        className="button secondary share-btn"
        aria-label="Share this publication"
      >
        {copied ? (
          <>
            <Check size={15} style={{ color: '#2e7d32' }} />
            <span>Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 size={15} />
            <span>Share Article</span>
          </>
        )}
      </button>
      {copied && <span className="share-toast">URL copied to clipboard</span>}
    </div>
  )
}

