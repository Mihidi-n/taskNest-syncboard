import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Auth.css'
import { joinBoard } from '../api.js'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [keepLoggedIn, setKeepLoggedIn] = useState(true)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (submitError) setSubmitError('')
  }

  function validate() {
    const nextErrors = {}
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!form.password) {
      nextErrors.password = 'Password is required.'
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }
    return nextErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setSubmitError('')
    try {
      await login({ email: form.email.trim(), password: form.password, keepLoggedIn })

      const pendingToken = sessionStorage.getItem('pendingJoinToken')
      if (pendingToken) {
        sessionStorage.removeItem('pendingJoinToken')
        try {
          const board = await joinBoard(pendingToken)
          navigate('/', { state: { selectBoardId: board.id } })
          return
        } catch {
          // link turned out to be bad — continue into the app normally
        }
      }

      navigate('/')
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-badge">TN</span>
          <span className="auth-logo-text">TaskNest</span>
        </div>

        <h1 className="auth-title">Log in</h1>
        <p className="auth-subtitle">Welcome back — pick up where you left off.</p>

        {submitError && <p className="auth-error-banner">{submitError}</p>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'auth-input--error' : ''}
            />
            {errors.email && <p className="auth-error-text">{errors.email}</p>}
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'auth-input--error' : ''}
            />
            {errors.password && <p className="auth-error-text">{errors.password}</p>}
          </div>

          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
            />
            Keep me logged in
          </label>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}