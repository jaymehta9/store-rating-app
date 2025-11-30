import React, { useEffect, useState } from "react"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000"

function AdminDashboard({ token, user, onLogout }) {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [userSearch, setUserSearch] = useState("")
  const [storeSearch, setStoreSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [userSort, setUserSort] = useState({ field: "name", order: "asc" })
  const [storeSort, setStoreSort] = useState({ field: "name", order: "asc" })
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "", role: "USER" })
  const [storeForm, setStoreForm] = useState({ name: "", email: "", address: "", ownerId: "" })

  useEffect(() => {
    fetchStats()
    fetchUsers()
    fetchStores()
  }, [])

  async function fetchStats() {
    const res = await fetch(API_BASE + "/api/admin/stats", {
      headers: { Authorization: "Bearer " + token }
    })
    const data = await res.json()
    if (res.ok) setStats(data)
  }

  async function fetchUsers() {
    const url = new URL(API_BASE + "/api/admin/users")
    if (userSearch) url.searchParams.set("search", userSearch)
    if (roleFilter) url.searchParams.set("role", roleFilter)
    if (userSort.field) {
      url.searchParams.set("sortField", userSort.field)
      url.searchParams.set("sortOrder", userSort.order)
    }

    const res = await fetch(url.toString(), {
      headers: { Authorization: "Bearer " + token }
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || "Please enter valid data.")
      return
    }
    setUsers(data)
  }

  async function fetchStores() {
    const url = new URL(API_BASE + "/api/admin/stores")
    if (storeSearch) url.searchParams.set("search", storeSearch)
    if (storeSort.field) {
      url.searchParams.set("sortField", storeSort.field)
      url.searchParams.set("sortOrder", storeSort.order)
    }

    const res = await fetch(url.toString(), {
      headers: { Authorization: "Bearer " + token }
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || "Please enter valid data.")
      return
    }
    setStores(data)
  }

  function toggleUserSort(field) {
    setUserSort(prev => {
      const order = prev.field === field && prev.order === "asc" ? "desc" : "asc"
      const next = { field, order }
      setTimeout(fetchUsers, 0)
      return next
    })
  }

  function toggleStoreSort(field) {
    setStoreSort(prev => {
      const order = prev.field === field && prev.order === "asc" ? "desc" : "asc"
      const next = { field, order }
      setTimeout(fetchStores, 0)
      return next
    })
  }

  // ❗ ERROR POPUP ONLY — NO SUCCESS POPUP
  async function handleUserSubmit(e) {
    e.preventDefault()

    const res = await fetch(API_BASE + "/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || "Please enter valid data.")
      return
    }

    // no success alert
    setForm({ name: "", email: "", address: "", password: "", role: "USER" })
    fetchUsers()
    fetchStats()
  }

  // ❗ ERROR POPUP ONLY — NO SUCCESS POPUP
  async function handleStoreSubmit(e) {
    e.preventDefault()

    const payload = { ...storeForm }
    if (!payload.ownerId) delete payload.ownerId

    const res = await fetch(API_BASE + "/api/admin/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || "Please enter valid data.")
      return
    }

    // no success alert
    setStoreForm({ name: "", email: "", address: "", ownerId: "" })
    fetchStores()
    fetchStats()
  }

  return (
    <div className="dashboard">
      <header className="top-bar">
        <div className="top-bar-left">
          <h1>Admin dashboard</h1>
          <p>System overview for {user.email}</p>
        </div>
        <button className="ghost-btn" onClick={onLogout}>Log out</button>
      </header>

      <section className="grid-3">
        <div className="stat-card">
          <span className="stat-label">Total users</span>
          <span className="stat-value">{stats ? stats.totalUsers : "–"}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total stores</span>
          <span className="stat-value">{stats ? stats.totalStores : "–"}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total ratings</span>
          <span className="stat-value">{stats ? stats.totalRatings : "–"}</span>
        </div>
      </section>

      <section className="panel-row">
        <div className="panel">
          <div className="panel-header">
            <h2>Add user</h2>
          </div>
          <form className="panel-form" onSubmit={handleUserSubmit}>
            <input value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} placeholder="Full name" required />
            <input value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} placeholder="Email" type="email" required />
            <textarea value={form.address} onChange={e => setForm(v => ({ ...v, address: e.target.value }))} placeholder="Address" rows={2} required />
            <input value={form.password} onChange={e => setForm(v => ({ ...v, password: e.target.value }))} placeholder="Password" type="password" required />
            <select value={form.role} onChange={e => setForm(v => ({ ...v, role: e.target.value }))}>
              <option value="USER">Normal user</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Store owner</option>
            </select>
            <button className="primary-btn" type="submit">Create user</button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Add store</h2>
          </div>
          <form className="panel-form" onSubmit={handleStoreSubmit}>
            <input value={storeForm.name} onChange={e => setStoreForm(v => ({ ...v, name: e.target.value }))} placeholder="Store name" required />
            <input value={storeForm.email} onChange={e => setStoreForm(v => ({ ...v, email: e.target.value }))} placeholder="Store email" type="email" required />
            <textarea value={storeForm.address} onChange={e => setStoreForm(v => ({ ...v, address: e.target.value }))} placeholder="Store address" rows={2} required />
            <input value={storeForm.ownerId} onChange={e => setStoreForm(v => ({ ...v, ownerId: e.target.value }))} placeholder="Owner user id (optional)" />
            <button className="primary-btn" type="submit">Create store</button>
          </form>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header space-between">
          <div>
            <h2>Users</h2>
            <p>Normal and admin users</p>
          </div>
          <div className="filters-row">
            <input className="filter-input" placeholder="Search by name, email, address" value={userSearch} onChange={e => setUserSearch(e.target.value)} onBlur={fetchUsers} />
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} onBlur={fetchUsers}>
              <option value="">All roles</option>
              <option value="USER">Normal</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleUserSort("name")}>Name</th>
                <th onClick={() => toggleUserSort("email")}>Email</th>
                <th onClick={() => toggleUserSort("address")}>Address</th>
                <th onClick={() => toggleUserSort("role")}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-cell">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header space-between">
          <div>
            <h2>Stores</h2>
            <p>Registered stores and ratings</p>
          </div>
          <div className="filters-row">
            <input className="filter-input" placeholder="Search by name, email, address" value={storeSearch} onChange={e => setStoreSearch(e.target.value)} onBlur={fetchStores} />
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleStoreSort("name")}>Store</th>
                <th onClick={() => toggleStoreSort("email")}>Email</th>
                <th onClick={() => toggleStoreSort("address")}>Address</th>
                <th onClick={() => toggleStoreSort("rating")}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>{Number(s.rating).toFixed(1)}</td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-cell">No stores found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
