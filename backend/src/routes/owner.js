import express from "express"
import { query } from "../db/index.js"

const router = express.Router()

router.get("/dashboard", async (req, res) => {
  try {
    const ownerId = req.user.id
    const storeResult = await query("select id,name,address from stores where owner_id=$1 limit 1", [ownerId])
    if (storeResult.rows.length === 0) {
      return res.json({ store: null, averageRating: 0, ratings: [] })
    }
    const store = storeResult.rows[0]
    const avgResult = await query("select coalesce(avg(rating),0) as avg from ratings where store_id=$1", [store.id])
    const avg = Number(avgResult.rows[0].avg)
    const ratings = await query(
      "select r.id,r.rating,u.name,u.email,u.address from ratings r join users u on u.id=r.user_id where r.store_id=$1 order by r.created_at desc",
      [store.id]
    )
    res.json({ store, averageRating: avg, ratings: ratings.rows })
  } catch (e) {
    res.status(500).json({ message: "server error" })
  }
})

export default router
