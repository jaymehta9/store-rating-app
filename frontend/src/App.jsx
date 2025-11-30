import React, { useState, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import UserDashboard from "./pages/UserDashboard.jsx"
import OwnerDashboard from "./pages/OwnerDashboard.jsx"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  function handleLogout() {
    setToken("")
    setUser(null)
    navigate("/login")
  }

  function renderDashboard() {
    if (!user) return null
    if (user.role === "ADMIN") return <AdminDashboard token={token} user={user} onLogout={handleLogout} />
    if (user.role === "OWNER") return <OwnerDashboard token={token} user={user} onLogout={handleLogout} />
    return <UserDashboard token={token} user={user} onLogout={handleLogout} />
  }

  return (
    <div className="app-shell">
      <Routes>
        <Route
          path="/login"
          element={
            token && user ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginPage
                onLogin={(t, u) => {
                  setToken(t)
                  setUser(u)
                  navigate("/dashboard")
                }}
              />
            )
          }
        />
        <Route
          path="/signup"
          element={
            token && user ? (
              <Navigate to="/dashboard" />
            ) : (
              <SignupPage
                onSignup={(t, u) => {
                  setToken(t)
                  setUser(u)
                  navigate("/dashboard")
                }}
              />
            )
          }
        />
        <Route path="/dashboard" element={token && user ? renderDashboard() : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token && user ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  )
}

export default App
