const BASE = 'http://localhost:5132'

function getToken() { return localStorage.getItem('access_token') }

async function req(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    return
  }
  const data = res.headers.get('content-type')?.includes('application/json') ? await res.json() : null
  if (!res.ok) throw new Error(data?.message || `Error ${res.status}`)
  return data
}

export const api = {
  // Auth
  register:       (body)  => req('POST', '/api/auth/register', body),
  login:          (body)  => req('POST', '/api/auth/login', body),
  me:             ()      => req('GET',  '/api/auth/me'),
  forgotPassword: (email) => req('POST', '/api/auth/forgot-password', { email }),
  resetPassword:  (token, newPassword) => req('POST', '/api/auth/reset-password', { token, newPassword }),
  updateProfile:  (body)  => req('PUT',  '/api/auth/profile', body),

  // Templates
  getTemplates:         ()       => req('GET',    '/api/templates'),
  adminGetAllTemplates: ()       => req('GET',    '/api/templates/admin/all'),
  createTemplate:       (body)   => req('POST',   '/api/templates', body),
  updateTemplate:       (id, b)  => req('PUT',    `/api/templates/${id}`, b),
  deleteTemplate:       (id)     => req('DELETE', `/api/templates/${id}`),

  // Analyses
  getAnalyses:   ()     => req('GET',    '/api/analyses'),
  getAnalysis:   (id)   => req('GET',    `/api/analyses/${id}`),
  saveAnalysis:  (body) => req('POST',   '/api/analyses', body),
  deleteAnalysis:(id)   => req('DELETE', `/api/analyses/${id}`),

  // Portfolio sharing
  sharePortfolio:    (analysisId, templateSlug) => req('POST', '/api/portfolio/share', { analysisId, templateSlug }),
  getSharedPortfolio:(slug) => req('GET', `/api/portfolio/${slug}`),
  myShares:          ()     => req('GET', '/api/portfolio/my-shares'),

  // Payments
  createOrder: (plan, coupon) => req('POST', '/api/payments/create-order', { plan, coupon }),
  myPayments:  ()             => req('GET',  '/api/payments/my-payments'),

  // Coupons
  validateCoupon:  (code) => req('POST',   '/api/coupons/validate', { code }),
  adminGetCoupons: ()     => req('GET',    '/api/coupons'),
  adminCreateCoupon:(body)=> req('POST',   '/api/coupons', body),
  adminToggleCoupon:(id)  => req('PUT',    `/api/coupons/${id}/toggle`),
  adminDeleteCoupon:(id)  => req('DELETE', `/api/coupons/${id}`),

  // Admin
  adminStats:    ()     => req('GET', '/api/admin/stats'),
  adminAnalytics:()     => req('GET', '/api/admin/analytics'),
  adminUsers:    (page, search) => req('GET', `/api/admin/users?page=${page}${search?'&search='+search:''}`),
  adminToggleUser:(id)  => req('PUT', `/api/admin/users/${id}/toggle-active`),
  adminToggleAdmin:(id) => req('PUT', `/api/admin/users/${id}/toggle-admin`),
  adminPayments: (page) => req('GET', `/api/admin/payments?page=${page}`),
}
