import React, { useEffect, useState } from "react"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000"

function OwnerDashboard({ token, user, onLogout }) {
  const [data, setData] = useState(null)
  const [password, setPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")

  useEffect(() => {
    fetchDashboard()
  }, [])

  async function fetchDashboard() {
    const res = await fetch(API_BASE + "/api/owner/dashboard", {
      headers: { Authorization: "Bearer " + token }
    })
    const data = await res.json()
    if (res.ok) setData(data)
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault()
    setPasswordMessage("")
    const res = await fetch(API_BASE + "/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ password })
    })
    const data = await res.json()
    if (res.ok) {
      setPasswordMessage("Password updated")
      setPassword("")
    } else {
      setPasswordMessage(data.message || "Unable to update password")
    }
  }

  return (
    <div className="dashboard">
      <header className="top-bar">
        <div className="top-bar-left">
          <h1>Store owner</h1>
          <p>Insights for your store</p>
        </div>
        <div className="top-bar-right">
          <span className="user-pill">{user.email}</span>
          <button className="ghost-btn" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <section className="panel-row">
        <div className="panel">
          <div className="panel-header">
            <h2>Update password</h2>
          </div>
          <form className="panel-form" onSubmit={handlePasswordUpdate}>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button className="primary-btn" type="submit">
              Save
            </button>
            {passwordMessage && <span className="hint-text">{passwordMessage}</span>}
          </form>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Your store</h2>
        </div>
        {!data || !data.store ? (
          <div className="empty-state">No store assigned to this account yet</div>
        ) : (
          <>
            <div className="store-summary">
              <div>
                <h3>{data.store.name}</h3>
                <p>{data.store.address}</p>
              </div>
              <div className="rating-pill">
                <span>Average rating</span>
                <strong>{Number(data.averageRating).toFixed(1)}</strong>
              </div>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ratings.map(r => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td>{r.email}</td>
                      <td>{r.address}</td>
                      <td>{r.rating}</td>
                    </tr>
                  ))}
                  {data.ratings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="empty-cell">
                        No ratings yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default OwnerDashboard
