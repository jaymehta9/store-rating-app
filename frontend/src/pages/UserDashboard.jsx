import React, { useEffect, useState } from "react"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000"

function UserDashboard({ token, user, onLogout }) {
  const [stores, setStores] = useState([])
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ field: "name", order: "asc" })
  const [password, setPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")

  useEffect(() => {
    fetchStores()
  }, [])

  async function fetchStores() {
    const url = new URL(API_BASE + "/api/stores")
    if (search) url.searchParams.set("search", search)
    if (sort.field) {
      url.searchParams.set("sortField", sort.field)
      url.searchParams.set("sortOrder", sort.order)
    }
    const res = await fetch(url.toString(), {
      headers: { Authorization: "Bearer " + token }
    })
    const data = await res.json()
    if (res.ok) setStores(data)
  }

  function toggleSort(field) {
    setSort(prev => {
      const order = prev.field === field && prev.order === "asc" ? "desc" : "asc"
      const next = { field, order }
      setTimeout(fetchStores, 0)
      return next
    })
  }

  async function handleRating(storeId, rating) {
    const res = await fetch(API_BASE + "/api/stores/" + storeId + "/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ rating })
    })
    if (res.ok) {
      fetchStores()
    }
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
          <h1>Store explorer</h1>
          <p>Browse and rate stores</p>
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
        <div className="panel-header space-between">
          <div>
            <h2>Stores</h2>
            <p>Submit and update your ratings</p>
          </div>
          <div className="filters-row">
            <input
              className="filter-input"
              placeholder="Search by name or address"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onBlur={fetchStores}
            />
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort("name")}>Store</th>
                <th onClick={() => toggleSort("address")}>Address</th>
                <th onClick={() => toggleSort("overall_rating")}>Overall rating</th>
                <th>Your rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.address}</td>
                  <td>{Number(s.overall_rating).toFixed(1)}</td>
                  <td>
                    <div className="rating-row">
                      {[1, 2, 3, 4, 5].map(value => (
                        <button
                          key={value}
                          type="button"
                          className={Number(s.user_rating) === value ? "chip chip-active" : "chip"}
                          onClick={() => handleRating(s.id, value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-cell">
                    No stores found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default UserDashboard
