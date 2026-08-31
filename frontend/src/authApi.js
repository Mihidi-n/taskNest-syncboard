const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

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

  return data // { token, user: { id, name, email } }
}

export function loginUser({ email, password }) {
  return request('/auth/login', { email, password })
}

export function registerUser({ name, email, password }) {
  return request('/auth/register', { name, email, password })
}