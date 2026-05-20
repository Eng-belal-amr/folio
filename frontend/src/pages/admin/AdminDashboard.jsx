import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import toast from 'react-hot-toast'
import {
  Users, BarChart2, CreditCard, Layers, Plus, Pencil,
  Trash2, ToggleLeft, ToggleRight, Shield, LogOut,
  Crown, Tag, TrendingUp, X
} from 'lucide-react'

// Mini bar chart
function BarChart({ data, color = '#d4a843', valueKey = 'count' }) {
  if (!data || data.length === 0) return <p className="text-canvas-400 text-xs text-center py-4">No data yet</p>
  const max = Math.max(...data.map(d => d[valueKey]), 1)
  return (
    <div className="flex items-end gap-1 h-24">
      {data.slice(-14).map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${item.date}: ${item[valueKey]}`}>
          <div className="w-full rounded-t transition-all" style={{ height: `${(item[valueKey]/max)*88}px`, background: color, minHeight: item[valueKey] > 0 ? 4 : 0 }} />
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [users, setUsers] = useState([])
  const [templates, setTemplates] = useState([])
  const [payments, setPayments] = useState([])
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [showCouponForm, setShowCouponForm] = useState(false)

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/dashboard'); return }
    loadData()
  }, [tab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (tab === 'overview') {
        const [s, a] = await Promise.all([api.adminStats(), api.adminAnalytics()])
        setStats(s); setAnalytics(a)
      }
      if (tab === 'users') setUsers((await api.adminUsers(1, search)).users)
      if (tab === 'templates') setTemplates(await api.adminGetAllTemplates())
      if (tab === 'payments') setPayments((await api.adminPayments(1)).payments)
      if (tab === 'coupons') setCoupons(await api.adminGetCoupons())
    } catch { toast.error('Load failed') }
    finally { setLoading(false) }
  }

  const tabs = [
    { id: 'overview',  label: 'Overview',  icon: BarChart2 },
    { id: 'users',     label: 'Users',     icon: Users },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'payments',  label: 'Payments',  icon: CreditCard },
    { id: 'coupons',   label: 'Coupons',   icon: Tag },
  ]

  return (
    <div className="min-h-screen bg-canvas-50 grain">
      {showTemplateForm && (
        <TemplateFormModal template={editingTemplate}
          onClose={() => { setShowTemplateForm(false); setEditingTemplate(null) }}
          onSave={() => { setShowTemplateForm(false); setEditingTemplate(null); loadData() }} />
      )}
      {showCouponForm && (
        <CouponFormModal onClose={() => setShowCouponForm(false)} onSave={() => { setShowCouponForm(false); loadData() }} />
      )}

      <nav className="bg-canvas-950 border-b border-canvas-800 sticky top-0 z-10">
        <div className="flex items-center justify-between px-8 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5">
              <span className="font-display text-xl font-semibold text-canvas-50">folio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            </Link>
            <span className="text-canvas-600 text-sm">/</span>
            <div className="flex items-center gap-1.5 bg-canvas-800 text-canvas-200 text-xs px-3 py-1 rounded-full">
              <Shield size={12} className="text-gold" /> Admin
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-canvas-400 text-sm">{user?.email}</span>
            <button onClick={() => { logout(); navigate('/') }} className="text-canvas-500 hover:text-canvas-200"><LogOut size={18} /></button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === id ? 'bg-canvas-950 text-canvas-50' : 'bg-white border border-canvas-100 text-canvas-500 hover:text-canvas-950'}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl shimmer-bg" />)}</div>
        ) : (
          <>
            {/* OVERVIEW */}
            {tab === 'overview' && stats && (
              <div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Users',    value: stats.totalUsers,    color: 'text-teal',       icon: Users },
                    { label: 'Pro Users',      value: stats.proUsers,      color: 'text-gold-dark',  icon: Crown },
                    { label: 'Analyses',       value: stats.totalAnalyses, color: 'text-violet',     icon: BarChart2 },
                    { label: 'Revenue (EGP)',  value: stats.totalRevenue.toLocaleString(), color: 'text-success', icon: TrendingUp },
                  ].map(({ label, value, color, icon: Icon }) => (
                    <div key={label} className="bg-white rounded-2xl border border-canvas-100 p-6">
                      <div className="flex items-center gap-2 mb-2"><Icon size={16} className={color} /><span className="text-canvas-400 text-xs">{label}</span></div>
                      <p className={`font-display text-3xl font-semibold ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>

                {analytics && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-canvas-100 p-5">
                      <p className="text-canvas-400 text-xs font-medium mb-3">Signups (last 14 days)</p>
                      <BarChart data={analytics.signups} color="#2a7c7c" valueKey="count" />
                    </div>
                    <div className="bg-white rounded-2xl border border-canvas-100 p-5">
                      <p className="text-canvas-400 text-xs font-medium mb-3">Revenue EGP (last 14 days)</p>
                      <BarChart data={analytics.revenue} color="#d4a843" valueKey="amount" />
                    </div>
                    <div className="bg-white rounded-2xl border border-canvas-100 p-5">
                      <p className="text-canvas-400 text-xs font-medium mb-3">Analyses (last 14 days)</p>
                      <BarChart data={analytics.analyses} color="#6b4fa8" valueKey="count" />
                    </div>
                    {analytics.templates?.length > 0 && (
                      <div className="bg-white rounded-2xl border border-canvas-100 p-5 md:col-span-3">
                        <p className="text-canvas-400 text-xs font-medium mb-3">Most popular templates</p>
                        <div className="flex gap-3 flex-wrap">
                          {analytics.templates.map(t => (
                            <div key={t.template} className="bg-canvas-50 border border-canvas-100 rounded-xl px-4 py-2">
                              <p className="font-medium text-canvas-950 text-sm capitalize">{t.template}</p>
                              <p className="text-canvas-400 text-xs">{t.count} uses</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* USERS */}
            {tab === 'users' && (
              <div className="bg-white rounded-3xl border border-canvas-100 overflow-hidden">
                <div className="p-5 border-b border-canvas-100 flex items-center justify-between gap-4">
                  <h2 className="font-semibold text-canvas-950">All Users ({users.length})</h2>
                  <input value={search} onChange={e => { setSearch(e.target.value) }} placeholder="Search by email or username…"
                    className="border border-canvas-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gold w-64" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-canvas-50 text-canvas-400 text-xs">
                      <tr>{['User','Email','Plan','Analyses','Joined','Status','Actions'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-canvas-50">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-canvas-50">
                          <td className="px-4 py-3 font-medium text-canvas-950">
                            {u.username}
                            {u.isAdmin && <span className="ml-2 text-xs bg-gold-muted text-gold-dark px-1.5 py-0.5 rounded-full">Admin</span>}
                          </td>
                          <td className="px-4 py-3 text-canvas-500">{u.email}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.plan === 'Free' ? 'bg-canvas-100 text-canvas-600' : 'bg-gold-muted text-gold-dark'}`}>{u.plan}</span></td>
                          <td className="px-4 py-3 text-canvas-500">{u.totalAnalyses}</td>
                          <td className="px-4 py-3 text-canvas-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.isActive ? 'Active' : 'Disabled'}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={async () => { await api.adminToggleUser(u.id); loadData() }} title="Toggle active">
                                {u.isActive ? <ToggleRight size={18} className="text-teal" /> : <ToggleLeft size={18} className="text-canvas-400" />}
                              </button>
                              <button onClick={async () => { await api.adminToggleAdmin(u.id); loadData() }} title="Toggle admin" className="text-canvas-400 hover:text-gold transition-colors">
                                <Shield size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TEMPLATES */}
            {tab === 'templates' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-canvas-950">All Templates ({templates.length})</h2>
                  <button onClick={() => { setEditingTemplate(null); setShowTemplateForm(true) }}
                    className="flex items-center gap-2 bg-canvas-950 text-canvas-50 text-sm px-4 py-2 rounded-full hover:bg-gold hover:text-canvas-950 transition-colors">
                    <Plus size={14} /> Add Template
                  </button>
                </div>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {templates.map(t => (
                    <div key={t.id} className={`bg-white rounded-2xl border ${t.isActive ? 'border-canvas-100' : 'border-dashed border-canvas-200 opacity-60'} p-4`}>
                      <div className="h-20 rounded-xl mb-3 overflow-hidden flex flex-col" style={{ background: t.previewBg }}>
                        <div className="flex items-center px-3 py-2 gap-2" style={{ borderBottom: `1px solid ${t.previewTag}` }}>
                          <div className="w-8 h-2 rounded-full" style={{ background: t.previewHeader }} />
                        </div>
                        <div className="flex-1 flex gap-2 p-2">
                          <div className="flex-1 space-y-1">
                            <div className="h-2 rounded" style={{ background: t.previewHeader, width: '60%' }} />
                            <div className="h-1.5 rounded" style={{ background: t.previewTag, width: '80%' }} />
                          </div>
                          <div className="w-10 space-y-1">
                            {[80,50,70].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ background: t.previewSkill, width: `${w}%` }} />)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-canvas-950 text-sm">{t.name}</p>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${t.isFree ? 'bg-teal-muted text-teal' : 'bg-gold-muted text-gold-dark'}`}>{t.isFree ? 'Free' : 'Pro'}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-canvas-100 text-canvas-500'}`}>{t.isActive ? 'On' : 'Off'}</span>
                        </div>
                      </div>
                      <p className="text-canvas-400 text-xs mb-3">{t.style}</p>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingTemplate(t); setShowTemplateForm(true) }} className="flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-950"><Pencil size={12} /> Edit</button>
                        <button onClick={async () => { if(confirm('Delete?')) { await api.deleteTemplate(t.id); loadData() } }} className="flex items-center gap-1 text-xs text-canvas-300 hover:text-danger"><Trash2 size={12} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAYMENTS */}
            {tab === 'payments' && (
              <div className="bg-white rounded-3xl border border-canvas-100 overflow-hidden">
                <div className="p-5 border-b border-canvas-100"><h2 className="font-semibold text-canvas-950">Payment History</h2></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-canvas-50 text-canvas-400 text-xs">
                      <tr>{['User','Plan','Amount','Status','Transaction ID','Date'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-canvas-50">
                      {payments.map(p => (
                        <tr key={p.id} className="hover:bg-canvas-50">
                          <td className="px-4 py-3"><p className="font-medium text-canvas-950">{p.user.username}</p><p className="text-canvas-400 text-xs">{p.user.email}</p></td>
                          <td className="px-4 py-3"><span className="bg-gold-muted text-gold-dark text-xs px-2 py-0.5 rounded-full">{p.plan}</span></td>
                          <td className="px-4 py-3 font-semibold">{p.amount} {p.currency}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${p.status==='Success'?'bg-green-100 text-green-700':p.status==='Pending'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>{p.status}</span></td>
                          <td className="px-4 py-3 text-canvas-400 text-xs font-mono">{p.paymobTransactionId||'—'}</td>
                          <td className="px-4 py-3 text-canvas-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* COUPONS */}
            {tab === 'coupons' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-canvas-950">Coupon Codes ({coupons.length})</h2>
                  <button onClick={() => setShowCouponForm(true)}
                    className="flex items-center gap-2 bg-canvas-950 text-canvas-50 text-sm px-4 py-2 rounded-full hover:bg-gold hover:text-canvas-950 transition-colors">
                    <Plus size={14} /> Create Coupon
                  </button>
                </div>
                <div className="bg-white rounded-3xl border border-canvas-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-canvas-50 text-canvas-400 text-xs">
                      <tr>{['Code','Discount','Uses','Expires','Status','Actions'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-canvas-50">
                      {coupons.map(c => (
                        <tr key={c.id} className="hover:bg-canvas-50">
                          <td className="px-4 py-3 font-mono font-bold text-canvas-950">{c.code}</td>
                          <td className="px-4 py-3"><span className="bg-gold-muted text-gold-dark text-xs px-2 py-1 rounded-full font-bold">{c.discountPercent}% OFF</span></td>
                          <td className="px-4 py-3 text-canvas-500">{c.usedCount} / {c.maxUses}</td>
                          <td className="px-4 py-3 text-canvas-400 text-xs">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.isActive ? 'Active' : 'Disabled'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={async () => { await api.adminToggleCoupon(c.id); loadData() }}
                                className="text-xs text-canvas-500 hover:text-canvas-950 transition-colors">
                                {c.isActive ? 'Disable' : 'Enable'}
                              </button>
                              <button onClick={async () => { if(confirm('Delete?')) { await api.adminDeleteCoupon(c.id); loadData() } }}
                                className="text-xs text-canvas-300 hover:text-danger transition-colors">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {coupons.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-canvas-400 text-sm">No coupons yet. Create one above.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function TemplateFormModal({ template, onClose, onSave }) {
  const [form, setForm] = useState(template || {
    slug:'',name:'',style:'',description:'',isFree:true,isActive:true,
    previewBg:'#fafaf8',previewHeader:'#1c1a16',previewSkill:'#d4a843',previewTag:'#f5edd8',sortOrder:10
  })
  const [loading, setLoading] = useState(false)
  const f = (field, val) => setForm({ ...form, [field]: val })

  const handleSave = async () => {
    setLoading(true)
    try {
      if (template?.id) await api.updateTemplate(template.id, form)
      else await api.createTemplate(form)
      toast.success(template ? 'Updated' : 'Created')
      onSave()
    } catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-canvas-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">{template ? 'Edit Template' : 'New Template'}</h2>
          <button onClick={onClose}><X size={18} className="text-canvas-400" /></button>
        </div>
        <div className="space-y-4">
          {!template && <div><label className="block text-sm font-medium text-canvas-700 mb-1">Slug</label><input value={form.slug} onChange={e => f('slug', e.target.value)} className="w-full border border-canvas-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold" /></div>}
          {[['name','Name'],['style','Style'],['description','Description']].map(([field,label]) => (
            <div key={field}><label className="block text-sm font-medium text-canvas-700 mb-1">{label}</label><input value={form[field]} onChange={e => f(field, e.target.value)} className="w-full border border-canvas-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold" /></div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            {[['previewBg','Background'],['previewHeader','Header'],['previewSkill','Skill bar'],['previewTag','Tag']].map(([field,label]) => (
              <div key={field}><label className="block text-xs font-medium text-canvas-500 mb-1">{label}</label>
                <div className="flex items-center gap-2"><input type="color" value={form[field]} onChange={e => f(field, e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" /><span className="text-xs font-mono text-canvas-500">{form[field]}</span></div>
              </div>
            ))}
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFree} onChange={e => f('isFree', e.target.checked)} className="accent-gold" /><span className="text-sm text-canvas-700">Free template</span></label>
            {template && <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e => f('isActive', e.target.checked)} className="accent-gold" /><span className="text-sm text-canvas-700">Active</span></label>}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-canvas-200 text-canvas-600 py-3 rounded-2xl text-sm hover:bg-canvas-50">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="flex-1 bg-canvas-950 text-canvas-50 py-3 rounded-2xl text-sm font-semibold hover:bg-gold hover:text-canvas-950 transition-all disabled:opacity-50">{loading ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

function CouponFormModal({ onClose, onSave }) {
  const [form, setForm] = useState({ code: '', discountPercent: 20, maxUses: 100, expiresAt: '' })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!form.code.trim()) { toast.error('Code is required'); return }
    setLoading(true)
    try {
      await api.adminCreateCoupon({ ...form, expiresAt: form.expiresAt || null })
      toast.success('Coupon created!')
      onSave()
    } catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-canvas-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">Create Coupon</h2>
          <button onClick={onClose}><X size={18} className="text-canvas-400" /></button>
        </div>
        <div className="space-y-4">
          {[
            ['Code', 'code', 'text', 'e.g. LAUNCH50'],
            ['Discount %', 'discountPercent', 'number', '20'],
            ['Max Uses', 'maxUses', 'number', '100'],
          ].map(([label, key, type, ph]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-canvas-700 mb-1.5">{label}</label>
              <input type={type} value={form[key]} placeholder={ph}
                onChange={e => setForm({ ...form, [key]: type === 'number' ? parseInt(e.target.value) : e.target.value })}
                className="w-full border border-canvas-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-canvas-700 mb-1.5">Expires At (optional)</label>
            <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full border border-canvas-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-canvas-200 text-canvas-600 py-3 rounded-2xl text-sm hover:bg-canvas-50">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="flex-1 bg-canvas-950 text-canvas-50 py-3 rounded-2xl text-sm font-semibold hover:bg-gold hover:text-canvas-950 transition-all disabled:opacity-50">{loading ? 'Creating…' : 'Create Coupon'}</button>
        </div>
      </div>
    </div>
  )
}
