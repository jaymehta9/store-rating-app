import express from "express"
import { query } from "../db/index.js"
import bcrypt from "bcryptjs"

const router = express.Router()

router.get("/stats", async (req, res) => {
  try {
    const users = await query("select count(*) from users")
    const stores = await query("select count(*) from stores")
    const ratings = await query("select count(*) from ratings")
    res.json({
      totalUsers: Number(users.rows[0].count),
      totalStores: Number(stores.rows[0].count),
      totalRatings: Number(ratings.rows[0].count)
    })
  } catch (e) {
    res.status(500).json({ message: "server error" })
  }
})

router.post("/users", async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body
    if (!name || name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: "invalid name" })
    }
    if (!address || address.length > 400) {
      return res.status(400).json({ message: "invalid address" })
    }
    if (!email) {
      return res.status(400).json({ message: "invalid email" })
    }
    if (!password || password.length < 8 || password.length > 16) {
      return res.status(400).json({ message: "invalid password" })
    }
    if (!/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({ message: "invalid password" })
    }
    const r = role === "ADMIN" || role === "OWNER" ? role : "USER"
    const existing = await query("select id from users where email=$1", [email])
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "email already used" })
    }
    const hash = await bcrypt.hash(password, 10)
    const result = await query(
      "insert into users (name,email,address,password_hash,role) values ($1,$2,$3,$4,$5) returning id,name,email,address,role",
      [name, email, address, hash, r]
    )
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ message: "server error" })
  }
})

router.get("/users", async (req, res) => {
  try {
    const { search, role, sortField, sortOrder } = req.query
    const whereParts = []
    const params = []
    let index = 1
    if (search) {
      whereParts.push("(name ilike $" + index + " or email ilike $" + (index + 1) + " or address ilike $" + (index + 2) + ")")
      params.push("%" + search + "%")
      params.push("%" + search + "%")
      params.push("%" + search + "%")
      index += 3
    }
    if (role) {
      whereParts.push("role = $" + index)
      params.push(role)
      index += 1
    }
    let text = "select id,name,email,address,role from users"
    if (whereParts.length > 0) {
      text += " where " + whereParts.join(" and ")
    }
    const allowedFields = ["name", "email", "address", "role"]
    const allowedOrder = ["asc", "desc"]
    if (sortField && allowedFields.includes(sortField)) {
      const order = sortOrder && allowedOrder.includes(sortOrder.toLowerCase()) ? sortOrder : "asc"
      text += " order by " + sortField + " " + order
    } else {
      text += " order by created_at desc"
    }
    const result = await query(text, params)
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ message: "server error" })
  }
})

router.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id
    const userResult = await query("select id,name,email,address,role from users where id=$1", [id])
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "not found" })
    }
    const user = userResult.rows[0]
    let storeRating = null
    if (user.role === "OWNER") {
      const store = await query("select id from stores where owner_id=$1 limit 1", [id])
      if (store.rows.length > 0) {
        const storeId = store.rows[0].id
        const avg = await query("select coalesce(avg(rating),0) as avg from ratings where store_id=$1", [storeId])
        storeRating = Number(avg.rows[0].avg)
      }
    }
    res.json({ user, storeRating })
  } catch (e) {
    res.status(500).json({ message: "server error" })
  }
})

router.post("/stores", async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body
    if (!name || name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: "invalid name" })
    }
    if (!address || address.length > 400) {
      return res.status(400).json({ message: "invalid address" })
    }
    if (!email) {
      return res.status(400).json({ message: "invalid email" })
    }
    let ownerIdValue = ownerId || null
    if (ownerIdValue) {
      const owner = await query("select id from users where id=$1 and role='OWNER'", [ownerIdValue])
      if (owner.rows.length === 0) {
        return res.status(400).json({ message: "invalid owner" })
      }
    }
    const result = await query(
      "insert into stores (name,email,address,owner_id) values ($1,$2,$3,$4) returning id,name,email,address,owner_id",
      [name, email, address, ownerIdValue]
    )
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ message: "server error" })
  }
})

router.get("/stores", async (req, res) => {
  try {
    const { search, sortField, sortOrder } = req.query
    const params = []
    let index = 1
    const whereParts = []
    if (search) {
      whereParts.push("(s.name ilike $" + index + " or s.email ilike $" + (index + 1) + " or s.address ilike $" + (index + 2) + ")")
      params.push("%" + search + "%")
      params.push("%" + search + "%")
      params.push("%" + search + "%")
      index += 3
    }
    let text = "select s.id,s.name,s.email,s.address,coalesce(avg(r.rating),0) as rating from stores s left join ratings r on r.store_id=s.id"
    if (whereParts.length > 0) {
      text += " where " + whereParts.join(" and ")
    }
    text += " group by s.id"
    const allowedFields = ["name", "email", "address", "rating"]
    const allowedOrder = ["asc", "desc"]
    if (sortField && allowedFields.includes(sortField)) {
      const order = sortOrder && allowedOrder.includes(sortOrder.toLowerCase()) ? sortOrder : "asc"
      text += " order by " + sortField + " " + order
    } else {
      text += " order by s.created_at desc"
    }
    const result = await query(text, params)
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ message: "server error" })
  }
})

export default router
