import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import toast from 'react-hot-toast'
import {
  FileText, Upload, Sparkles, Clock, Trash2, Crown,
  ChevronRight, BarChart2, LogOut, Settings, Share2,
  Copy, Check, X, CreditCard, Sparkle, GitCompare
} from 'lucide-react'

const planColors = {
  Free: 'bg-canvas-100 text-canvas-600',
  Monthly: 'bg-teal-muted text-teal',
  Annual: 'bg-gold-muted text-gold-dark',
  PayPerUse: 'bg-violet-muted text-violet',
}

function ShareModal({ analysis, onClose, isPro }) {
  const [slug, setSlug] = useState(null)
  const [template, setTemplate] = useState('lumiere')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const freeTemplates = ['lumiere', 'verdant', 'nova']
  const proTemplates = ['gilded', 'aurora', 'blush', 'slate', 'terra', 'arctic', 'obsidian']
  const availableTemplates = isPro
    ? [...freeTemplates, ...proTemplates]
    : freeTemplates

  const handleShare = async () => {
    setLoading(true)
    try {
      const data = await api.sharePortfolio(analysis.id, template)
      setSlug(data.slug)
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const shareUrl = slug ? `${window.location.origin}/p/${slug}` : null

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-canvas-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold">Share Portfolio</h2>
          <button onClick={onClose}><X size={18} className="text-canvas-400" /></button>
        </div>
        {!slug ? (
          <>
            <p className="text-canvas-500 text-sm mb-4">Choose a template for your shared portfolio link.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-canvas-700 mb-1.5">Template</label>
              <select value={template} onChange={e => setTemplate(e.target.value)}
                className="w-full border border-canvas-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold">
                {availableTemplates.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
                ))}
              {!isPro && (
                <option disabled>── Pro templates (upgrade to unlock) ──</option>
              )}
              </select>
            </div>
            <button onClick={handleShare} disabled={loading}
              className="w-full bg-canvas-950 text-canvas-50 py-3 rounded-2xl font-medium text-sm hover:bg-gold hover:text-canvas-950 transition-all disabled:opacity-50">
              {loading ? 'Creating link…' : 'Generate Share Link'}
            </button>
          </>
        ) : (
          <div>
            <p className="text-canvas-500 text-sm mb-4">Your portfolio is live! Share this link:</p>
            <div className="flex items-center gap-2 bg-canvas-50 border border-canvas-200 rounded-xl p-3 mb-4">
              <span className="text-canvas-700 text-sm flex-1 truncate font-mono text-xs">{shareUrl}</span>
              <button onClick={handleCopy} className="flex items-center gap-1 text-xs bg-canvas-950 text-canvas-50 px-3 py-1.5 rounded-lg hover:bg-gold hover:text-canvas-950 transition-colors flex-shrink-0">
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>
            <a href={shareUrl} target="_blank" rel="noreferrer"
              className="block text-center text-teal text-sm hover:underline">Open portfolio →</a>
          </div>
        )}
      </div>
    </div>
  )
}

function CompareModal({ analyses, onClose }) {
  const [a, setA] = useState(analyses[0]?.id || '')
  const [b, setB] = useState(analyses[1]?.id || '')
  const dataA = analyses.find(x => x.id === parseInt(a))
  const dataB = analyses.find(x => x.id === parseInt(b))

  const metrics = ['overallScore']
  const scoreColor = s => s >= 80 ? '#2d7a4f' : s >= 60 ? '#d4a843' : '#a32d2d'

  return (
    <div className="fixed inset-0 bg-canvas-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold">Compare Analyses</h2>
          <button onClick={onClose}><X size={18} className="text-canvas-400" /></button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[['Analysis A', a, setA], ['Analysis B', b, setB]].map(([label, val, setter]) => (
            <div key={label}>
              <label className="block text-xs font-medium text-canvas-500 mb-1.5">{label}</label>
              <select value={val} onChange={e => setter(e.target.value)}
                className="w-full border border-canvas-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold">
                {analyses.map(an => <option key={an.id} value={an.id}>{an.candidateName} ({new Date(an.createdAt).toLocaleDateString()})</option>)}
              </select>
            </div>
          ))}
        </div>
        {dataA && dataB && (
          <div className="grid grid-cols-2 gap-4">
            {[dataA, dataB].map((item, i) => (
              <div key={i} className="bg-canvas-50 rounded-2xl p-4 border border-canvas-100">
                <p className="font-semibold text-canvas-950 text-sm mb-1">{item.candidateName}</p>
                <p className="text-canvas-400 text-xs mb-3">{item.candidateTitle}</p>
                <div className="text-center">
                  <p className="font-display text-4xl font-bold" style={{ color: scoreColor(item.overallScore) }}>{item.overallScore}</p>
                  <p className="text-canvas-400 text-xs">/ 100</p>
                </div>
                {item.overallScore > (i === 0 ? dataB : dataA).overallScore && (
                  <div className="mt-3 text-center">
                    <span className="text-xs bg-teal-muted text-teal px-2 py-0.5 rounded-full font-medium">Higher score ✦</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout, refreshUser } = useAuth()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [shareTarget, setShareTarget] = useState(null)
  const [showCompare, setShowCompare] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    loadAnalyses(); refreshUser()
  }, [])

  const loadAnalyses = async () => {
    try { setAnalyses(await api.getAnalyses()) }
    catch { toast.error('Failed to load analyses') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this analysis?')) return
    try { await api.deleteAnalysis(id); setAnalyses(analyses.filter(a => a.id !== id)); toast.success('Deleted') }
    catch { toast.error('Failed to delete') }
  }

  const isPro = user?.isProActive

  return (
    <div className="min-h-screen bg-canvas-50 grain">
      {shareTarget && <ShareModal analysis={shareTarget} onClose={() => setShareTarget(null)} isPro={isPro} />}
      {showCompare && analyses.length >= 2 && <CompareModal analyses={analyses} onClose={() => setShowCompare(false)} />}
      {showUpgrade && <UpgradeModal user={user} onClose={() => setShowUpgrade(false)} onSuccess={() => { setShowUpgrade(false); refreshUser() }} />}

      <nav className="bg-white border-b border-canvas-100 sticky top-0 z-10">
        <div className="flex items-center justify-between px-8 py-4 max-w-5xl mx-auto">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="font-display text-xl font-semibold text-canvas-950">folio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          </Link>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${planColors[user?.plan] || planColors.Free}`}>{user?.plan || 'Free'}</span>
            {!isPro && (
              <button onClick={() => setShowUpgrade(true)}
                className="flex items-center gap-1.5 bg-gold text-canvas-950 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gold-light transition-colors">
                <Crown size={12} /> Upgrade
              </button>
            )}
            <Link to="/profile" className="text-canvas-400 hover:text-canvas-950 transition-colors"><Settings size={18} /></Link>
            <button onClick={() => { logout(); navigate('/') }} className="text-canvas-400 hover:text-canvas-950 transition-colors"><LogOut size={18} /></button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-semibold text-canvas-950 mb-1">Welcome back, {user?.username} 👋</h1>
          <p className="text-canvas-400">{isPro ? 'Pro account · Unlimited analyses' : `Free plan · ${analyses.length}/3 analyses used this month`}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Analyses', value: analyses.length, icon: BarChart2, color: 'text-teal' },
            { label: 'Plan', value: user?.plan || 'Free', icon: Crown, color: 'text-gold-dark' },
            { label: 'Templates', value: isPro ? 'All 10' : '3 Free', icon: Sparkles, color: 'text-violet' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-canvas-100 p-5">
              <div className="flex items-center gap-2 mb-2"><Icon size={16} className={color} /><span className="text-canvas-400 text-xs">{label}</span></div>
              <p className="font-display text-2xl font-semibold text-canvas-950">{value}</p>
            </div>
          ))}
        </div>

        {/* Pro upsell */}
        {!isPro && (
          <div className="bg-canvas-950 rounded-3xl p-6 mb-8 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1"><Crown size={16} className="text-gold" /><span className="text-gold text-sm font-semibold">Upgrade to Pro</span></div>
              <p className="text-canvas-300 text-sm">Unlimited analyses · All 10 templates · Share portfolio links · Priority support</p>
            </div>
            <button onClick={() => setShowUpgrade(true)}
              className="bg-gold text-canvas-950 px-6 py-3 rounded-full font-semibold text-sm hover:bg-gold-light transition-colors flex-shrink-0">
              View Plans
            </button>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Upload, bg: 'bg-gold-muted', iconColor: 'text-gold-dark', hoverBg: 'group-hover:bg-gold', hoverIcon: 'group-hover:text-canvas-950', label: 'New Analysis', sub: 'Upload a CV', action: () => navigate('/upload') },
            { icon: Sparkles, bg: 'bg-teal-muted', iconColor: 'text-teal', hoverBg: 'group-hover:bg-teal', hoverIcon: 'group-hover:text-white', label: 'Browse Templates', sub: isPro ? 'All 10 unlocked' : '3 free available', action: () => navigate('/templates') },
            { icon: GitCompare, bg: 'bg-violet-muted', iconColor: 'text-violet', hoverBg: 'group-hover:bg-violet', hoverIcon: 'group-hover:text-white', label: 'Compare CVs', sub: analyses.length >= 2 ? 'Compare two analyses' : 'Need 2+ analyses', action: () => analyses.length >= 2 ? setShowCompare(true) : toast.error('You need at least 2 analyses to compare.') },
          ].map(({ icon: Icon, bg, iconColor, hoverBg, hoverIcon, label, sub, action }) => (
            <button key={label} onClick={action}
              className="bg-white border border-canvas-100 rounded-2xl p-5 flex items-center gap-4 hover:border-gold/50 hover:shadow-md transition-all text-left group">
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center ${hoverBg} transition-colors`}>
                <Icon size={20} className={`${iconColor} ${hoverIcon} transition-colors`} />
              </div>
              <div><p className="font-semibold text-canvas-950">{label}</p><p className="text-canvas-400 text-sm">{sub}</p></div>
              <ChevronRight size={16} className="text-canvas-300 ml-auto" />
            </button>
          ))}
        </div>

        {/* Analyses */}
        <div className="bg-white rounded-3xl border border-canvas-100 p-6">
          <h2 className="font-display text-xl font-semibold text-canvas-950 mb-5 flex items-center gap-2">
            <Clock size={18} className="text-canvas-400" /> Recent Analyses
          </h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-canvas-100 rounded-2xl shimmer-bg" />)}</div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-10">
              <FileText size={32} className="text-canvas-200 mx-auto mb-3" />
              <p className="text-canvas-400 text-sm">No analyses yet.</p>
              <button onClick={() => navigate('/upload')}
                className="mt-4 bg-canvas-950 text-canvas-50 text-sm px-5 py-2.5 rounded-full hover:bg-gold hover:text-canvas-950 transition-colors">
                Analyze your first CV
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.map(a => (
                <div key={a.id} className="flex items-center gap-4 p-4 border border-canvas-100 rounded-2xl hover:border-canvas-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gold-muted flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-gold-dark text-sm">{a.overallScore}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-canvas-950 text-sm truncate">{a.candidateName}</p>
                    <p className="text-canvas-400 text-xs">{a.candidateTitle} · {new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/result?id=${a.id}`)} className="text-teal text-xs hover:underline">View</button>
                    <button onClick={() => setShareTarget(a)} className="text-canvas-400 hover:text-violet transition-colors" title="Share">
                      <Share2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="text-canvas-300 hover:text-danger transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {!isPro && (
                <p className="text-canvas-400 text-xs text-center pt-2">
                  Free plan shows last 3 analyses.{' '}
                  <button onClick={() => setShowUpgrade(true)} className="text-gold-dark underline">Upgrade for full history</button>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function UpgradeModal({ user, onClose, onSuccess }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const plans = [
    { key: 'monthly',   label: 'Monthly',      price: 199,  unit: '/mo',  desc: 'Billed monthly, cancel anytime' },
    { key: 'annual',    label: 'Annual',        price: 1499, unit: '/yr',  desc: 'Save 37% vs monthly', badge: 'Best Value' },
    { key: 'payperuse', label: 'Pay Per Use',   price: 29,   unit: '',     desc: 'Single analysis + 30 days access' },
  ]

  const proFeatures = [
    'Unlimited CV analyses',
    'All 10 portfolio templates',
    'Full analysis history',
    'Share portfolio links',
    'Remove Folio branding',
    'Priority email support',
    'CV comparison tool',
    'Custom domain guide',
  ]

  const validateCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const data = await api.validateCoupon(couponCode)
      setDiscount(data.discount)
      toast.success(`Coupon applied! ${data.discount}% off`)
    } catch (err) { toast.error(err.message); setDiscount(null) }
    finally { setCouponLoading(false) }
  }

  const finalPrice = (price) => discount ? Math.round(price * (1 - discount / 100)) : price

  const handlePay = async () => {
    setLoading(true)
    try {
      const data = await api.createOrder(selectedPlan, discount ? couponCode : null)
      window.open(data.iframeUrl, '_blank', 'width=700,height=600')
      toast.success('Payment window opened. Complete payment to activate Pro.')
      let attempts = 0
      const check = setInterval(async () => {
        await onSuccess()
        attempts++
        if (attempts > 20) clearInterval(check)
      }, 5000)
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-canvas-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-canvas-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1"><Crown size={18} className="text-gold" /><span className="text-gold font-semibold text-sm">Folio Pro</span></div>
              <h2 className="font-display text-2xl font-semibold text-canvas-50">Choose your plan</h2>
            </div>
            <button onClick={onClose} className="text-canvas-500 hover:text-canvas-200">✕</button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3 mb-5">
            {plans.map(p => (
              <button key={p.key} onClick={() => setSelectedPlan(p.key)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedPlan === p.key ? 'border-gold bg-gold-muted' : 'border-canvas-100 hover:border-canvas-300'}`}>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-canvas-950">{p.label}</span>
                    {p.badge && <span className="bg-teal text-white text-xs px-2 py-0.5 rounded-full">{p.badge}</span>}
                  </div>
                  <span className="text-canvas-400 text-xs">{p.desc}</span>
                </div>
                <div className="text-right">
                  {discount ? (
                    <div>
                      <span className="text-canvas-300 line-through text-sm mr-1">EGP {p.price}</span>
                      <span className="font-bold text-canvas-950">EGP {finalPrice(p.price)}</span>
                    </div>
                  ) : (
                    <span className="font-bold text-canvas-950">EGP {p.price}{p.unit}</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Coupon code */}
          <div className="flex gap-2 mb-5">
            <input value={couponCode} onChange={e => setCouponCode(e.target.value)}
              placeholder="Coupon code (optional)"
              className="flex-1 border border-canvas-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gold" />
            <button onClick={validateCoupon} disabled={couponLoading}
              className="bg-canvas-100 text-canvas-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-canvas-200 transition-colors disabled:opacity-50">
              {couponLoading ? '…' : 'Apply'}
            </button>
          </div>

          <div className="bg-canvas-50 rounded-2xl p-4 mb-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-canvas-400 mb-3">Everything included</p>
            <div className="grid grid-cols-2 gap-y-2">
              {proFeatures.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-teal-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-teal text-xs">✓</span>
                  </div>
                  <span className="text-canvas-600 text-xs">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handlePay} disabled={loading}
            className="w-full bg-canvas-950 text-canvas-50 py-3.5 rounded-2xl font-semibold hover:bg-gold hover:text-canvas-950 transition-all disabled:opacity-50">
            {loading ? 'Opening payment…' : `Pay with Paymob`}
          </button>
          <p className="text-canvas-400 text-xs text-center mt-2">Secured by Paymob · Visa, Mastercard, Fawry accepted</p>
        </div>
      </div>
    </div>
  )
}
