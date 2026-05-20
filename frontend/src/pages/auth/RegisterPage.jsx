import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { saveAuth } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const data = await api.register(form)
      saveAuth(data)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-canvas-50 grain flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 font-display text-3xl font-semibold text-canvas-950">
            folio <span className="w-2 h-2 rounded-full bg-gold inline-block mb-1" />
          </Link>
          <p className="text-canvas-400 text-sm mt-2">Create your free account</p>
        </div>

        <div className="bg-white rounded-3xl border border-canvas-100 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-canvas-700 mb-1.5">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-canvas-400" />
                <input type="text" required value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="yourname"
                  className="w-full pl-10 pr-4 py-3 border border-canvas-200 rounded-xl text-sm outline-none focus:border-gold transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-canvas-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-canvas-400" />
                <input type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-canvas-200 rounded-xl text-sm outline-none focus:border-gold transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-canvas-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-canvas-400" />
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-3 border border-canvas-200 rounded-xl text-sm outline-none focus:border-gold transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-3.5 text-canvas-400 hover:text-canvas-700">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="bg-gold-muted border border-gold/20 rounded-2xl p-3 text-xs text-canvas-600">
              Free plan includes 3 analyses/month · Upgrade to Pro for unlimited + all templates
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-canvas-950 text-canvas-50 py-3 rounded-2xl font-medium text-sm hover:bg-gold hover:text-canvas-950 transition-all disabled:opacity-50">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-canvas-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-canvas-950 font-medium hover:text-gold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
