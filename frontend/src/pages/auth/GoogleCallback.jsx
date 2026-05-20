import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import toast from 'react-hot-toast'

export default function GoogleCallback() {
  const navigate = useNavigate()
  const { saveAuth } = useAuth()

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace('#', '?'))
    const accessToken = params.get('access_token')

    if (!accessToken) { navigate('/login'); return }

    // Get user info from Google
    fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
      .then(r => r.json())
      .then(async (profile) => {
        // Use sub as id_token workaround — send access token to backend
        const data = await api.googleLogin(accessToken)
        saveAuth(data)
        toast.success('Signed in with Google!')
        navigate(data.user.isAdmin ? '/admin' : '/dashboard')
      })
      .catch(() => {
        toast.error('Google sign-in failed.')
        navigate('/login')
      })
  }, [])

  return (
    <div className="min-h-screen bg-canvas-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-canvas-200 border-t-gold rounded-full animate-spin mx-auto mb-3" />
        <p className="text-canvas-400 text-sm">Signing you in…</p>
      </div>
    </div>
  )
}
