import express from "express"
import { query } from "../db/index.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const { search, sortField, sortOrder } = req.query
    const params = []
    let index = 1
    const whereParts = []
    if (search) {
      whereParts.push("(s.name ilike $" + index + " or s.address ilike $" + (index + 1) + ")")
      params.push("%" + search + "%")
      params.push("%" + search + "%")
      index += 2
    }
    let text =
      "select s.id,s.name,s.address,coalesce(avg(r.rating),0) as overall_rating,coalesce(max(case when r.user_id=$" +
      index +
      " then r.rating end),0) as user_rating from stores s left join ratings r on r.store_id=s.id"
    params.push(req.user.id)
    index += 1
    if (whereParts.length > 0) {
      text += " where " + whereParts.join(" and ")
    }
    text += " group by s.id"
    const allowedFields = ["name", "address", "overall_rating"]
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

router.post("/:storeId/rate", async (req, res) => {
  try {
    const storeId = req.params.storeId
    const { rating } = req.body
    const value = Number(rating)
    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: "invalid rating" })
    }
    const userId = req.user.id
    const existing = await query("select id from ratings where user_id=$1 and store_id=$2", [userId, storeId])
    if (existing.rows.length > 0) {
      const id = existing.rows[0].id
      await query("update ratings set rating=$1,updated_at=now() where id=$2", [value, id])
    } else {
      await query("insert into ratings (user_id,store_id,rating) values ($1,$2,$3)", [userId, storeId, value])
    }
    res.json({ message: "saved" })
  } catch (e) {
    res.status(500).json({ message: "server error" })
  }
})

export default router
