import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.forgotPassword(email)
      setSent(true)
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
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-teal-muted flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-teal" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-canvas-950 mb-2">Check your email</h2>
              <p className="text-canvas-400 text-sm mb-6">We sent a reset link to <strong>{email}</strong>. Check your inbox and spam folder.</p>
              <Link to="/login" className="text-canvas-950 font-medium hover:text-gold transition-colors text-sm">Back to sign in</Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 text-canvas-400 hover:text-canvas-950 text-sm mb-6 transition-colors">
                <ArrowLeft size={14} /> Back to sign in
              </Link>
              <h2 className="font-display text-2xl font-semibold text-canvas-950 mb-1">Forgot password?</h2>
              <p className="text-canvas-400 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-canvas-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-canvas-400" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-canvas-200 rounded-xl text-sm outline-none focus:border-gold transition-colors" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-canvas-950 text-canvas-50 py-3 rounded-2xl font-medium text-sm hover:bg-gold hover:text-canvas-950 transition-all disabled:opacity-50">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
