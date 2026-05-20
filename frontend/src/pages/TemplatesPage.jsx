import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Code2, Lock, Crown, Eye, Download, X } from 'lucide-react'
import { useAnalysis } from '../hooks/useAnalysis'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { generatePortfolio } from '../templates/index'
import toast from 'react-hot-toast'

const deploySteps = {
  local: [
    { n:1, title:'Open the folder', cmd:'—', desc:'Unzip the downloaded file anywhere on your computer' },
    { n:2, title:'Open index.html', cmd:'—', desc:'Double-click index.html — it opens directly in your browser, no setup needed' },
    { n:3, title:'Done!', cmd:'—', desc:'Your portfolio is running locally. Customize the HTML file as you like.' },
  ],
  vercel: [
    { n:1, title:'Go to Vercel', cmd:'vercel.com', desc:'Sign in with GitHub' },
    { n:2, title:'Drag & drop', cmd:'—', desc:'Drag your unzipped folder onto the Vercel deploy page' },
    { n:3, title:'Live in seconds', cmd:'—', desc:'Vercel gives you a free .vercel.app URL instantly' },
  ],
  netlify: [
    { n:1, title:'Go to Netlify', cmd:'app.netlify.com/drop', desc:'Open the Netlify drop page' },
    { n:2, title:'Drag & drop', cmd:'—', desc:'Drag your unzipped folder onto the page' },
    { n:3, title:'Live!', cmd:'—', desc:'Get a free .netlify.app URL in under 30 seconds' },
  ],
}

function TemplatePreview({ t }) {
  return (
    <div className="w-full h-36 rounded-xl overflow-hidden flex flex-col" style={{ background: t.previewBg }}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: t.previewTag }}>
        <div className="w-12 h-2.5 rounded-full" style={{ background: t.previewHeader }} />
        <div className="flex gap-1.5">
          {[1,2,3].map(i => <div key={i} className="w-8 h-1.5 rounded-full" style={{ background: t.previewTag }} />)}
        </div>
      </div>
      <div className="flex-1 flex gap-3 p-3">
        <div className="flex-1 space-y-2">
          <div className="h-3 rounded" style={{ background: t.previewHeader, width:'60%' }} />
          <div className="h-2 rounded" style={{ background: t.previewTag, width:'80%' }} />
          <div className="h-2 rounded" style={{ background: t.previewTag, width:'50%' }} />
          <div className="flex gap-1.5 mt-2">
            {[1,2,3].map(i => <div key={i} className="h-4 rounded-full" style={{ background: t.previewTag, width: 24+i*8 }} />)}
          </div>
        </div>
        <div className="w-16 space-y-1.5 pt-1">
          {[80,60,90,45].map((w,i) => <div key={i} className="h-1.5 rounded-full" style={{ background: t.previewSkill, width:`${w}%`, maxWidth:40 }} />)}
        </div>
      </div>
    </div>
  )
}

function LivePreviewModal({ html, templateName, onClose, onDownload }) {
  const iframeRef = useRef(null)

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      doc.open()
      doc.write(html)
      doc.close()
    }
  }, [html])

  return (
    <div className="fixed inset-0 bg-canvas-950/90 backdrop-blur-sm z-50 flex flex-col">
      {/* Modal nav */}
      <div className="flex items-center justify-between px-6 py-4 bg-canvas-950 border-b border-canvas-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-canvas-400 hover:text-canvas-50 transition-colors">
            <X size={20} />
          </button>
          <span className="text-canvas-50 font-medium text-sm">Preview — {templateName}</span>
          <span className="text-canvas-500 text-xs bg-canvas-800 px-2 py-0.5 rounded-full">Your real data</span>
        </div>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 bg-gold text-canvas-950 px-5 py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-colors"
        >
          <Download size={14} /> Download Portfolio
        </button>
      </div>
      {/* Live iframe */}
      <iframe
        ref={iframeRef}
        className="flex-1 w-full border-0"
        title="Portfolio Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}

export default function TemplatesPage() {
  const navigate = useNavigate()
  const { analysisResult, selectedTemplate, setSelectedTemplate } = useAnalysis()
  const { user } = useAuth()
  const [templates, setTemplates] = useState([])
  const [chosen, setChosen] = useState(selectedTemplate?.slug || null)
  const [showDeploy, setShowDeploy] = useState(false)
  const [deployTab, setDeployTab] = useState('netlify')
  const [loading, setLoading] = useState(true)
  const [previewHtml, setPreviewHtml] = useState(null)
  const [previewTemplate, setPreviewTemplate] = useState(null)

  const isPro = user?.isProActive

  useEffect(() => {
    api.getTemplates()
      .then(t => { setTemplates(t); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSelect = (t) => {
    if (!t.isFree && !isPro) {
      toast.error('Upgrade to Pro to use this template.')
      return
    }
    setChosen(t.slug)
    setSelectedTemplate(t)
  }

  const handlePreview = (t, e) => {
    e.stopPropagation()
    if (!t.isFree && !isPro) { toast.error('Upgrade to Pro to preview this template.'); return }
    if (!analysisResult) { toast.error('Upload a CV first to see your real data in the template.'); return }
    const html = generatePortfolio(t.slug, analysisResult)
    setPreviewHtml(html)
    setPreviewTemplate(t)
  }

  const handleDownload = (templateSlug, templateName) => {
    if (!analysisResult) { toast.error('Upload a CV first.'); return }
    const html = generatePortfolio(templateSlug, analysisResult)
    // Create ZIP-like download (single HTML file — no build needed)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${analysisResult.personal?.name?.replace(/\s+/g, '_') || 'portfolio'}_${templateSlug}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Portfolio downloaded! Open the .html file in your browser.')
    setShowDeploy(true)
    setPreviewHtml(null)
  }

  const handleGenerate = () => {
    if (!chosen) return
    if (!analysisResult) { toast.error('Upload a CV first.'); navigate('/upload'); return }
    handleDownload(chosen, templates.find(t => t.slug === chosen)?.name)
  }

  return (
    <div className="min-h-screen bg-canvas-50 grain">
      {previewHtml && (
        <LivePreviewModal
          html={previewHtml}
          templateName={previewTemplate?.name}
          onClose={() => setPreviewHtml(null)}
          onDownload={() => handleDownload(previewTemplate.slug, previewTemplate.name)}
        />
      )}

      <nav className="bg-white border-b border-canvas-100 sticky top-0 z-10">
        <div className="flex items-center justify-between px-8 py-4 max-w-5xl mx-auto">
          <button onClick={() => navigate(analysisResult ? '/result' : '/dashboard')}
            className="flex items-center gap-2 text-canvas-400 hover:text-canvas-950 text-sm transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-xl font-semibold text-canvas-950">folio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          </div>
          {!isPro ? (
            <button onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 bg-gold text-canvas-950 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gold-light transition-colors">
              <Crown size={12} /> Upgrade for all
            </button>
          ) : <div className="w-24" />}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Deploy instructions */}
        {showDeploy && (
          <div className="bg-canvas-950 rounded-3xl p-8 mb-10">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="font-display text-3xl font-semibold text-canvas-50 mb-1">Portfolio downloaded! 🎉</h2>
                <p className="text-canvas-400 text-sm">You have a single HTML file — no build step needed. Here's what to do next:</p>
              </div>
              <button onClick={handleGenerate}
                className="flex items-center gap-2 bg-gold text-canvas-950 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-light transition-colors">
                <Download size={14} /> Download Again
              </button>
            </div>
            <div className="flex gap-2 mb-6">
              {['local','vercel','netlify'].map(tab => (
                <button key={tab} onClick={() => setDeployTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${deployTab === tab ? 'bg-canvas-700 text-canvas-50' : 'text-canvas-400 hover:text-canvas-200'}`}>
                  {tab === 'local' ? '👁 Open Locally' : tab === 'vercel' ? '▲ Vercel' : '◈ Netlify'}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {deploySteps[deployTab].map(step => (
                <div key={step.n} className="flex items-start gap-4 bg-canvas-900 rounded-2xl p-4">
                  <span className="w-7 h-7 rounded-full bg-gold text-canvas-950 text-xs font-bold flex items-center justify-center flex-shrink-0">{step.n}</span>
                  <div className="flex-1">
                    <p className="text-canvas-200 font-medium text-sm mb-0.5">{step.title}</p>
                    <p className="text-canvas-500 text-xs">{step.desc}</p>
                  </div>
                  {step.cmd !== '—' && (
                    <a href={`https://${step.cmd}`} target="_blank" rel="noreferrer"
                      className="bg-canvas-800 text-gold-light text-xs px-3 py-1.5 rounded-lg font-mono flex-shrink-0 hover:bg-canvas-700 transition-colors">
                      {step.cmd}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mb-10">
          <h1 className="font-display text-5xl font-semibold text-canvas-950 mb-3">Choose a Template</h1>
          <p className="text-canvas-400">
            {isPro ? 'All 10 templates unlocked ✦ Click Preview to see your real portfolio' : '3 free templates · Upgrade to unlock all 10 with 3D effects'}
          </p>
          {!analysisResult && (
            <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-2 rounded-full">
              ⚠ Upload a CV first to preview templates with your real data
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-5">{[...Array(6)].map((_,i) => <div key={i} className="h-52 rounded-2xl shimmer-bg" />)}</div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {templates.map(t => {
              const isLocked = !t.isFree && !isPro
              const isSelected = chosen === t.slug
              return (
                <div key={t.id} onClick={() => handleSelect(t)}
                  className={`bg-white rounded-2xl border-2 overflow-hidden transition-all cursor-pointer group ${
                    isLocked ? 'opacity-75' :
                    isSelected ? 'border-gold shadow-lg shadow-gold/20 -translate-y-0.5' :
                    'border-canvas-100 hover:border-canvas-300 hover:-translate-y-0.5'
                  }`}>
                  <div className="relative">
                    <TemplatePreview t={t} />
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gold flex items-center justify-center shadow">
                        <Check size={12} className="text-canvas-950" />
                      </div>
                    )}
                    {isLocked ? (
                      <div className="absolute inset-0 bg-canvas-950/40 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="bg-white rounded-xl px-3 py-2 flex items-center gap-1.5 shadow">
                          <Lock size={11} className="text-canvas-500" />
                          <span className="text-canvas-700 text-xs font-medium">Pro</span>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-canvas-950/0 group-hover:bg-canvas-950/30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                        <button
                          onClick={(e) => handlePreview(t, e)}
                          className="flex items-center gap-1.5 bg-white text-canvas-950 text-xs font-semibold px-3 py-2 rounded-full shadow hover:bg-gold transition-colors"
                        >
                          <Eye size={12} /> Preview
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-semibold text-canvas-950 text-sm">{t.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.isFree ? 'bg-teal-muted text-teal' : 'bg-gold-muted text-gold-dark'}`}>
                        {t.isFree ? 'Free' : 'Pro'}
                      </span>
                    </div>
                    <p className="text-canvas-400 text-xs">{t.style}</p>
                    {!t.isFree && <p className="text-violet text-xs mt-0.5 font-medium">✦ 3D Effects</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!isPro && (
          <div className="bg-canvas-950 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-0.5"><Crown size={14} className="text-gold" /><p className="text-canvas-50 font-semibold text-sm">Unlock all 10 templates with 3D effects</p></div>
              <p className="text-canvas-400 text-xs">Upgrade to Pro — from EGP 199/month</p>
            </div>
            <button onClick={() => navigate('/dashboard')}
              className="bg-gold text-canvas-950 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gold-light transition-colors flex-shrink-0">
              Upgrade to Pro
            </button>
          </div>
        )}

        {chosen && (
          <div className="text-center">
            <button onClick={handleGenerate}
              className="inline-flex items-center gap-3 bg-canvas-950 text-canvas-50 px-10 py-4 rounded-full text-lg font-medium hover:bg-gold hover:text-canvas-950 transition-all">
              <Download size={20} /> Download My Portfolio
            </button>
            <p className="text-canvas-400 text-sm mt-3">
              Template: <strong className="text-canvas-700">{templates.find(t => t.slug === chosen)?.name}</strong>
              {' · '}Single HTML file · No setup needed
            </p>
          </div>
        )}
        {!chosen && <p className="text-center text-canvas-400 text-sm">← Select a template above to continue</p>}
      </div>
    </div>
  )
}
