import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { api } from '../../services/api'
import toast from 'react-hot-toast'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) { toast.error('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await api.resetPassword(token, password)
      toast.success('Password reset! Please sign in.')
      navigate('/login')
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
        </div>
        <div className="bg-white rounded-3xl border border-canvas-100 p-8 shadow-sm">
          <h2 className="font-display text-2xl font-semibold text-canvas-950 mb-1">Set new password</h2>
          <p className="text-canvas-400 text-sm mb-6">Enter your new password below.</p>
          {!token ? (
            <p className="text-danger text-sm">Invalid reset link. <Link to="/forgot-password" className="underline">Request a new one</Link>.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-canvas-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-canvas-400" />
                  <input type={showPw ? 'text' : 'password'} required value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-3 border border-canvas-200 rounded-xl text-sm outline-none focus:border-gold transition-colors" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-3.5 text-canvas-400 hover:text-canvas-700">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-canvas-950 text-canvas-50 py-3 rounded-2xl font-medium text-sm hover:bg-gold hover:text-canvas-950 transition-all disabled:opacity-50">
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
