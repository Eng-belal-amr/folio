import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AnalysisProvider } from './hooks/useAnalysis'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import UploadPage from './pages/UploadPage'
import ResultPage from './pages/ResultPage'
import TemplatesPage from './pages/TemplatesPage'
import ProfilePage from './pages/ProfilePage'
import SharedPortfolioPage from './pages/SharedPortfolioPage'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}
function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/p/:slug" element={<SharedPortfolioPage />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
      <Route path="/result" element={<PrivateRoute><ResultPage /></PrivateRoute>} />
      <Route path="/templates" element={<PrivateRoute><TemplatesPage /></PrivateRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AnalysisProvider>
        <Toaster position="top-right" toastOptions={{
          style: { fontFamily: 'Outfit, sans-serif', fontSize: '14px', background: '#1c1a16', color: '#fafaf8', borderRadius: '10px', border: '1px solid #47433b' }
        }} />
        <AppRoutes />
      </AnalysisProvider>
    </AuthProvider>
  )
}
