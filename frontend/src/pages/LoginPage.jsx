import React, { useState } from "react"
import { Link } from "react-router-dom"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000"

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(API_BASE + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "login failed")
      } else {
        onLogin(data.token, data.user)
      }
    } catch (e) {
      setError("network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to manage stores and ratings</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
          </label>
          <label>
            <span>Password</span>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter your password" required />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="auth-footer">
          <span>New here?</span>
          <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
