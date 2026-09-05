const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

export function loginUser({ email, password }) {
  return request('/api/auth/login', { email, password })
}

export function registerUser({ name, email, password }) {
  return request('/api/auth/register', { name, email, password })
}