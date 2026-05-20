import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { saveAuth } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await api.login(form)
      saveAuth(data)
      toast.success(`Welcome back, ${data.user.username}!`)
      navigate(data.user.isAdmin ? '/admin' : '/dashboard')
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-canvas-50 grain flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 font-display text-3xl font-semibold text-canvas-950">
            folio <span className="w-2 h-2 rounded-full bg-gold inline-block mb-1" />
          </Link>
          <p className="text-canvas-400 text-sm mt-2">Sign in to your account</p>
        </div>
        <div className="bg-white rounded-3xl border border-canvas-100 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-canvas-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-canvas-400" />
                <input type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-canvas-200 rounded-xl text-sm text-canvas-950 outline-none focus:border-gold transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-canvas-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-canvas-400 hover:text-gold transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-canvas-400" />
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-canvas-200 rounded-xl text-sm text-canvas-950 outline-none focus:border-gold transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-3.5 text-canvas-400 hover:text-canvas-700">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-canvas-950 text-canvas-50 py-3 rounded-2xl font-medium text-sm hover:bg-gold hover:text-canvas-950 transition-all disabled:opacity-50 mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-canvas-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-canvas-950 font-medium hover:text-gold transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
