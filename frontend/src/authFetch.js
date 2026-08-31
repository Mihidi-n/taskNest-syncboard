/**
 * authFetch — a drop-in replacement for fetch() that automatically
 * attaches the logged-in user's token. Use this for ANY call to a
 * protected endpoint (boards, columns, tasks) — not just auth routes.
 */
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(url, { ...options, headers })

  if (res.status === 401) {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    window.location.href = '/login'
  }

  return res
}