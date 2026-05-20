import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import { generatePortfolio } from '../templates/index'
import { Eye, Download, ArrowLeft } from 'lucide-react'

export default function SharedPortfolioPage() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const iframeRef = useRef(null)

  useEffect(() => {
    api.getSharedPortfolio(slug)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Portfolio not found or no longer public.'); setLoading(false) })
  }, [slug])

  useEffect(() => {
    if (!data || !iframeRef.current) return
    const result = JSON.parse(data.resultJson)
    const html = generatePortfolio(data.templateSlug, result)
    const doc = iframeRef.current.contentDocument
    doc.open(); doc.write(html); doc.close()
  }, [data])

  const handleDownload = () => {
    if (!data) return
    const result = JSON.parse(data.resultJson)
    const html = generatePortfolio(data.templateSlug, result)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${data.candidateName?.replace(/\s+/g,'_')}_portfolio.html`
    a.click(); URL.revokeObjectURL(url)
  }

  if (loading) return (
    <div className="min-h-screen bg-canvas-50 grain flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-canvas-200 border-t-gold rounded-full animate-spin mx-auto mb-3" />
        <p className="text-canvas-400 text-sm">Loading portfolio…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-canvas-50 grain flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-canvas-950 font-semibold text-lg mb-2">Portfolio not found</p>
        <p className="text-canvas-400 text-sm mb-6">{error}</p>
        <Link to="/" className="text-gold hover:underline text-sm">Go to Folio →</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-canvas-950">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-canvas-950 border-b border-canvas-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="font-display text-lg font-semibold text-canvas-50">folio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          </Link>
          <span className="text-canvas-600 text-xs">·</span>
          <span className="text-canvas-300 text-sm">{data?.candidateName}'s Portfolio</span>
          <div className="flex items-center gap-1 text-canvas-500 text-xs">
            <Eye size={12} /> {data?.viewCount} views
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleDownload}
            className="flex items-center gap-2 bg-gold text-canvas-950 px-4 py-2 rounded-full text-xs font-semibold hover:bg-gold-light transition-colors">
            <Download size={12} /> Download
          </button>
          <Link to="/register"
            className="flex items-center gap-2 bg-canvas-800 text-canvas-200 px-4 py-2 rounded-full text-xs font-medium hover:bg-canvas-700 transition-colors">
            Create yours →
          </Link>
        </div>
      </div>
      {/* Full portfolio iframe */}
      <iframe ref={iframeRef} className="flex-1 w-full border-0" title="Portfolio"
        sandbox="allow-scripts allow-same-origin" />
    </div>
  )
}
