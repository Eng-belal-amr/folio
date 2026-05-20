import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalysis } from '../hooks/useAnalysis'
import {
  ArrowLeft, AlertTriangle, Info, User, Briefcase,
  Code2, GraduationCap, Globe, RotateCcw, ChevronRight,
  Palette, Download, FileText, Copy, Check
} from 'lucide-react'

const scoreColor = s => s >= 80 ? '#2d7a4f' : s >= 60 ? '#d4a843' : s >= 40 ? '#b5620e' : '#a32d2d'
const scoreLabel = s => s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : s >= 40 ? 'Fair' : 'Needs Work'

const suggestionStyles = {
  critical:    { bg: 'bg-red-50',     border: 'border-red-100',     text: 'text-red-800',     badge: 'bg-red-100 text-red-700' },
  improvement: { bg: 'bg-amber-50',   border: 'border-amber-100',   text: 'text-amber-800',   badge: 'bg-amber-100 text-amber-700' },
  optional:    { bg: 'bg-canvas-50',  border: 'border-canvas-200',  text: 'text-canvas-700',  badge: 'bg-canvas-100 text-canvas-500' },
}

const categoryColors = {
  Frontend: 'bg-violet-muted text-violet',
  Backend:  'bg-teal-muted text-teal',
  Database: 'bg-gold-muted text-gold-dark',
  DevOps:   'bg-canvas-100 text-canvas-700',
  Tools:    'bg-canvas-100 text-canvas-600',
  Design:   'bg-rose-muted text-rose',
  Other:    'bg-canvas-100 text-canvas-500',
}

function ScoreRing({ score }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = scoreColor(score)
  return (
    <div className="relative w-36 h-36 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f2f1ec" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold text-canvas-950">{score}</span>
        <span className="text-xs mt-0.5" style={{ color }}>{scoreLabel(score)}</span>
      </div>
    </div>
  )
}

function SkillBar({ skill }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-canvas-700 font-medium">{skill.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[skill.category] || 'bg-canvas-100 text-canvas-500'}`}>
            {skill.category}
          </span>
        </div>
        <div className="h-1.5 bg-canvas-100 rounded-full overflow-hidden">
          <div className="h-full bg-canvas-950 rounded-full skill-bar-fill" style={{ '--target-w': `${skill.level}%` }} />
        </div>
      </div>
      <span className="text-xs font-mono text-canvas-400 w-7 text-right">{skill.level}</span>
    </div>
  )
}

function ImprovedCVTab({ improvedCV, name }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedCV)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([improvedCV], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(name || 'cv').replace(/\s+/g, '_')}_improved.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-3xl border border-canvas-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-semibold text-canvas-950 flex items-center gap-2">
          <FileText size={18} className="text-teal" /> Improved CV
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-canvas-100 hover:bg-canvas-200 text-canvas-700 text-sm px-4 py-2 rounded-xl transition-colors"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-canvas-950 hover:bg-gold hover:text-canvas-950 text-canvas-50 text-sm px-4 py-2 rounded-xl transition-colors"
          >
            <Download size={14} /> Download .txt
          </button>
        </div>
      </div>
      <div className="bg-canvas-50 border border-canvas-100 rounded-2xl p-5 max-h-[600px] overflow-y-auto">
        <pre className="text-canvas-700 text-sm leading-relaxed whitespace-pre-wrap font-body">
          {improvedCV}
        </pre>
      </div>
      <p className="text-canvas-400 text-xs mt-3">
        This is a plain-text version. Copy it into Word, Google Docs, or any editor and apply your preferred formatting.
      </p>
    </div>
  )
}

export default function ResultPage() {
  const navigate = useNavigate()
  const { analysisResult } = useAnalysis()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!analysisResult) navigate('/upload')
  }, [analysisResult, navigate])

  if (!analysisResult) return null
  const r = analysisResult

  const criticalCount = (r.cv_suggestions || []).filter(s => s.type === 'critical').length

  const tabs = [
    { id: 'overview',    label: 'Overview',    icon: User },
    { id: 'suggestions', label: `Suggestions${criticalCount > 0 ? ` (${criticalCount})` : ''}`, icon: AlertTriangle },
    { id: 'improved',    label: 'Improved CV', icon: FileText },
    { id: 'skills',      label: 'Skills',      icon: Code2 },
    { id: 'experience',  label: 'Experience',  icon: Briefcase },
  ]

  return (
    <div className="min-h-screen bg-canvas-50 grain">
      {/* Nav */}
      <nav className="bg-white border-b border-canvas-100 sticky top-0 z-10">
        <div className="flex items-center justify-between px-8 py-4 max-w-5xl mx-auto">
          <button onClick={() => navigate('/upload')} className="flex items-center gap-2 text-canvas-400 hover:text-canvas-950 text-sm transition-colors">
            <ArrowLeft size={16} /> Upload another
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-xl font-semibold text-canvas-950">folio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          </div>
          <button
            onClick={() => navigate('/templates')}
            className="flex items-center gap-2 bg-canvas-950 text-canvas-50 text-sm px-4 py-2 rounded-full hover:bg-gold hover:text-canvas-950 transition-all"
          >
            <Palette size={14} /> Choose Template
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Hero card */}
        <div className="bg-white rounded-3xl border border-canvas-100 p-8 mb-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <ScoreRing score={r.overall_score} />
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-1 flex-wrap">
              <h1 className="font-display text-4xl font-semibold text-canvas-950">{r.personal?.name}</h1>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-gold-muted text-gold-dark border border-gold/20">
                {r.personal?.title}
              </span>
            </div>
            <p className="text-base italic mb-4" style={{ color: scoreColor(r.overall_score) }}>{r.verdict}</p>
            <p className="text-canvas-500 text-sm leading-relaxed max-w-2xl">{r.personal?.bio}</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-6">
              {Object.entries(r.scores || {}).map(([key, val]) => (
                <div key={key} className="bg-canvas-50 rounded-xl p-3 text-center border border-canvas-100">
                  <p className="text-lg font-bold font-mono" style={{ color: scoreColor(val) }}>{val}</p>
                  <p className="text-canvas-400 text-xs mt-0.5 leading-tight capitalize">{key.replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 bg-white border border-canvas-100 rounded-2xl p-1.5 overflow-x-auto w-fit max-w-full">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === id ? 'bg-canvas-950 text-canvas-50' : 'text-canvas-500 hover:text-canvas-950'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-canvas-100 p-6">
              <h2 className="font-display text-xl font-semibold text-canvas-950 mb-4 flex items-center gap-2">
                <Globe size={18} className="text-teal" /> Contact & Links
              </h2>
              <div className="space-y-2">
                {[
                  ['Email', r.personal?.email],
                  ['Phone', r.personal?.phone],
                  ['Location', r.personal?.location],
                  ['LinkedIn', r.personal?.linkedin],
                  ['GitHub', r.personal?.github],
                  ['Website', r.personal?.website],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2 border-b border-canvas-50 last:border-0">
                    <span className="text-canvas-400 text-sm">{k}</span>
                    <span className="text-canvas-950 text-sm font-medium truncate max-w-[60%] text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-canvas-100 p-6">
              <h2 className="font-display text-xl font-semibold text-canvas-950 mb-4 flex items-center gap-2">
                <GraduationCap size={18} className="text-violet" /> Education
              </h2>
              <div className="space-y-4">
                {(r.education || []).map((e, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-muted flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-bold text-violet text-sm">{(e.institution || '?').charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-canvas-950 text-sm">{e.institution}</p>
                      <p className="text-canvas-500 text-xs">{e.degree}</p>
                      <p className="text-canvas-400 text-xs mt-0.5 font-mono">{e.year}</p>
                    </div>
                  </div>
                ))}
              </div>
              {(r.certifications?.length > 0 || r.languages?.length > 0) && (
                <div className="mt-4 pt-4 border-t border-canvas-100 space-y-3">
                  {r.certifications?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-canvas-400 mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-1.5">
                        {r.certifications.map(c => <span key={c} className="bg-canvas-100 text-canvas-700 text-xs px-2.5 py-1 rounded-lg">{c}</span>)}
                      </div>
                    </div>
                  )}
                  {r.languages?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-canvas-400 mb-2">Languages</p>
                      <div className="flex flex-wrap gap-1.5">
                        {r.languages.map(l => <span key={l} className="bg-canvas-100 text-canvas-700 text-xs px-2.5 py-1 rounded-lg">{l}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {r.projects?.length > 0 && (
              <div className="bg-white rounded-3xl border border-canvas-100 p-6 md:col-span-2">
                <h2 className="font-display text-xl font-semibold text-canvas-950 mb-4 flex items-center gap-2">
                  <Code2 size={18} className="text-gold-dark" /> Projects
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {r.projects.map((p, i) => (
                    <div key={i} className="border border-canvas-100 rounded-2xl p-4 hover:border-gold/40 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-canvas-950">{p.name}</p>
                        {p.link && (
                          <a href={p.link} target="_blank" rel="noreferrer" className="text-teal text-xs hover:underline flex items-center gap-1">
                            View <ChevronRight size={12} />
                          </a>
                        )}
                      </div>
                      <p className="text-canvas-500 text-sm leading-relaxed mb-3">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(p.tech || []).map(t => (
                          <span key={t} className="bg-canvas-100 text-canvas-600 text-xs px-2 py-0.5 rounded-lg font-mono">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Suggestions */}
        {activeTab === 'suggestions' && (
          <div className="bg-white rounded-3xl border border-canvas-100 p-6">
            <h2 className="font-display text-xl font-semibold text-canvas-950 mb-2 flex items-center gap-2">
              <Info size={18} className="text-gold-dark" /> CV Improvement Suggestions
            </h2>
            <p className="text-canvas-400 text-sm mb-5">
              Apply these to strengthen your CV before sharing it with employers.
            </p>
            <div className="space-y-3">
              {(r.cv_suggestions || []).map((s, i) => {
                const style = suggestionStyles[s.type] || suggestionStyles.optional
                return (
                  <div key={i} className={`${style.bg} border ${style.border} rounded-2xl p-4`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${style.badge}`}>
                        {s.type}
                      </span>
                      <p className={`font-semibold text-sm ${style.text}`}>{s.title}</p>
                    </div>
                    <p className={`text-sm leading-relaxed ${style.text} opacity-80`}>{s.detail}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 pt-5 border-t border-canvas-100 flex items-center justify-between">
              <p className="text-canvas-400 text-sm">Want to see the improved version?</p>
              <button
                onClick={() => setActiveTab('improved')}
                className="flex items-center gap-2 bg-canvas-950 text-canvas-50 text-sm px-4 py-2 rounded-xl hover:bg-gold hover:text-canvas-950 transition-colors"
              >
                <FileText size={14} /> View Improved CV
              </button>
            </div>
          </div>
        )}

        {/* Tab: Improved CV */}
        {activeTab === 'improved' && (
          <ImprovedCVTab improvedCV={r.improved_cv || 'No improved CV was generated. Please re-analyze your CV.'} name={r.personal?.name} />
        )}

        {/* Tab: Skills */}
        {activeTab === 'skills' && (
          <div className="bg-white rounded-3xl border border-canvas-100 p-6">
            <h2 className="font-display text-xl font-semibold text-canvas-950 mb-5">Skills Breakdown</h2>
            <div className="space-y-4">
              {(r.skills || []).sort((a, b) => b.level - a.level).map(s => (
                <SkillBar key={s.name} skill={s} />
              ))}
            </div>
          </div>
        )}

        {/* Tab: Experience */}
        {activeTab === 'experience' && (
          <div className="bg-white rounded-3xl border border-canvas-100 p-6">
            <h2 className="font-display text-xl font-semibold text-canvas-950 mb-5">Work Experience</h2>
            <div className="space-y-6">
              {(r.experience || []).map((e, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-xl bg-teal-muted flex items-center justify-center flex-shrink-0">
                      <Briefcase size={14} className="text-teal" />
                    </div>
                    {i < (r.experience.length - 1) && <div className="w-px flex-1 bg-canvas-100 mt-2" />}
                  </div>
                  <div className="pb-6">
                    <p className="font-semibold text-canvas-950">{e.role}</p>
                    <p className="text-canvas-500 text-sm">{e.company}</p>
                    <p className="text-canvas-400 text-xs font-mono mt-0.5 mb-2">{e.duration}</p>
                    <p className="text-canvas-600 text-sm leading-relaxed">{e.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 bg-canvas-950 rounded-3xl p-8 text-center">
          <h2 className="font-display text-3xl font-semibold text-canvas-50 mb-2">Ready to build your portfolio?</h2>
          <p className="text-canvas-400 text-sm mb-6">Choose a template and we'll generate your complete portfolio website.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate('/templates')}
              className="inline-flex items-center gap-2 bg-gold text-canvas-950 px-6 py-3 rounded-full font-semibold hover:bg-gold-light transition-colors"
            >
              <Palette size={16} /> Choose a Template
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="inline-flex items-center gap-2 text-canvas-300 text-sm hover:text-canvas-50 transition-colors"
            >
              <RotateCcw size={14} /> Upload new CV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Auto-save analysis when result is loaded (appended logic — handled in UploadPage)
