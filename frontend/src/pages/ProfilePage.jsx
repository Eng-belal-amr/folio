import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft, User, Lock, Check } from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()
  const [username, setUsername] = useState(user?.username || '')
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  const handleUsername = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.updateProfile({ username })
      await refreshUser()
      toast.success('Username updated!')
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPw !== pwForm.confirm) { toast.error('Passwords do not match.'); return }
    if (pwForm.newPw.length < 6) { toast.error('Password must be at least 6 characters.'); return }
    setPwLoading(true)
    try {
      await api.updateProfile({ currentPassword: pwForm.current, newPassword: pwForm.newPw })
      setPwForm({ current: '', newPw: '', confirm: '' })
      toast.success('Password changed!')
    } catch (err) { toast.error(err.message) }
    finally { setPwLoading(false) }
  }

  return (
    <div className="min-h-screen bg-canvas-50 grain">
      <nav className="bg-white border-b border-canvas-100 sticky top-0 z-10">
        <div className="flex items-center justify-between px-8 py-4 max-w-2xl mx-auto">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-canvas-400 hover:text-canvas-950 text-sm">
            <ArrowLeft size={16} /> Dashboard
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-xl font-semibold text-canvas-950">folio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          </div>
          <div className="w-20" />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <h1 className="font-display text-4xl font-semibold text-canvas-950">Profile Settings</h1>

        {/* Account info */}
        <div className="bg-white rounded-3xl border border-canvas-100 p-6">
          <h2 className="font-semibold text-canvas-950 mb-1 flex items-center gap-2"><User size={16} className="text-teal" /> Account</h2>
          <p className="text-canvas-400 text-xs mb-5">Email: <strong className="text-canvas-700">{user?.email}</strong> (cannot be changed)</p>
          <form onSubmit={handleUsername} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-canvas-700 mb-1.5">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)}
                className="w-full border border-canvas-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-gold transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 bg-canvas-950 text-canvas-50 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gold hover:text-canvas-950 transition-all disabled:opacity-50">
              {loading ? 'Saving…' : <><Check size={14} /> Save Username</>}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-3xl border border-canvas-100 p-6">
          <h2 className="font-semibold text-canvas-950 mb-5 flex items-center gap-2"><Lock size={16} className="text-violet" /> Change Password</h2>
          <form onSubmit={handlePassword} className="space-y-4">
            {[
              ['Current Password', 'current', 'Your current password'],
              ['New Password', 'newPw', 'Min 6 characters'],
              ['Confirm New Password', 'confirm', 'Repeat new password'],
            ].map(([label, key, ph]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-canvas-700 mb-1.5">{label}</label>
                <input type="password" value={pwForm[key]}
                  onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                  placeholder={ph}
                  className="w-full border border-canvas-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-gold transition-colors" />
              </div>
            ))}
            <button type="submit" disabled={pwLoading}
              className="flex items-center gap-2 bg-canvas-950 text-canvas-50 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gold hover:text-canvas-950 transition-all disabled:opacity-50">
              {pwLoading ? 'Updating…' : <><Check size={14} /> Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
