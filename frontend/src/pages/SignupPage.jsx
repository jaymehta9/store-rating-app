import React, { useState } from "react"
import { Link } from "react-router-dom"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000"

function SignupPage({ onSignup }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(API_BASE + "/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, address, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "signup failed")
      } else {
        onSignup(data.token, data.user)
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
          <h1>Create account</h1>
          <p>Join the store rating platform</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Full name</span>
            <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="At least 20 characters" required />
          </label>
          <label>
            <span>Email</span>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
          </label>
          <label>
            <span>Address</span>
            <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Your address" rows={3} required />
          </label>
          <label>
            <span>Password</span>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="8-16 chars, 1 uppercase, 1 special"
              required
            />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
