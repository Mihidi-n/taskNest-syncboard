import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Auth.css'

/**
 * RegisterPage
 * Pure front-end UI + validation for now — no backend call yet.
 * Once Role 1 (Auth) has a working /api/auth/register endpoint, swap
 * the TODO in handleSubmit for a real request (see api.js from Role 6).
 */
export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function validate() {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Name is required.'
    }

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

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.'
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    return nextErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      // TODO (once Role 1 / Role 6 are ready): replace with a real call, e.g.
      // await registerUser({ name: form.name, email: form.email, password: form.password })
      console.log('Register submitted:', form)
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

        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Set up your boards in a couple of minutes.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'auth-input--error' : ''}
            />
            {errors.name && <p className="auth-error-text">{errors.name}</p>}
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
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
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'auth-input--error' : ''}
            />
            {errors.password && <p className="auth-error-text">{errors.password}</p>}
          </div>

          <div className="auth-field">
            <label htmlFor="register-confirm">Confirm password</label>
            <input
              id="register-confirm"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'auth-input--error' : ''}
            />
            {errors.confirmPassword && (
              <p className="auth-error-text">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}
