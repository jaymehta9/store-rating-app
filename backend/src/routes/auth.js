import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "../db/index.js"

const router = express.Router()

router.post("/signup", async (req, res) => {
  try {
    const { name, email, address, password } = req.body
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
    const existing = await query("select id from users where email=$1", [email])
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "email already used" })
    }
    const hash = await bcrypt.hash(password, 10)
    const result = await query(
      "insert into users (name,email,address,password_hash,role) values ($1,$2,$3,$4,$5) returning id,role",
      [name, email, address, hash, "USER"]
    )
    const user = result.rows[0]
    const token = jwt.sign(
      { id: user.id, email, role: user.role },
      process.env.JWT_SECRET || "changeme",
      { expiresIn: "7d" }
    )
    res.json({ token, user: { id: user.id, name, email, address, role: user.role } })
  } catch (e) {
    res.status(500).json({ message: "server error" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await query("select id,name,email,address,password_hash,role from users where email=$1", [email])
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "invalid credentials" })
    }
    const user = result.rows[0]
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(400).json({ message: "invalid credentials" })
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "changeme",
      { expiresIn: "7d" }
    )
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    })
  } catch (e) {
    res.status(500).json({ message: "server error" })
  }
})

router.post("/password", async (req, res) => {
  try {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "unauthorized" })
    }
    const token = auth.split(" ")[1]
    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "changeme")
    } catch (e) {
      return res.status(401).json({ message: "invalid token" })
    }
    const { password } = req.body
    if (!password || password.length < 8 || password.length > 16) {
      return res.status(400).json({ message: "invalid password" })
    }
    if (!/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({ message: "invalid password" })
    }
    const hash = await bcrypt.hash(password, 10)
    await query("update users set password_hash=$1 where id=$2", [hash, payload.id])
    res.json({ message: "updated" })
  } catch (e) {
    res.status(500).json({ message: "server error" })
  }
})

export default router
