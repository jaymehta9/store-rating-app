import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.js"
import adminRouter from "./routes/admin.js"
import storeRouter from "./routes/store.js"
import ownerRouter from "./routes/owner.js"
import { authMiddleware } from "./middleware/auth.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ status: "ok" })
})

app.use("/api/auth", authRouter)
app.use("/api/admin", authMiddleware(["ADMIN"]), adminRouter)
app.use("/api/stores", authMiddleware(["USER", "ADMIN", "OWNER"]), storeRouter)
app.use("/api/owner", authMiddleware(["OWNER"]), ownerRouter)

app.listen(port, () => {
  console.log("server running on port " + port)
})
