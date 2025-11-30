import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export function authMiddleware(roles) {
  return function (req, res, next) {
    const header = req.headers.authorization
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "unauthorized" })
    }
    const token = header.split(" ")[1]
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "changeme")
      if (roles && roles.length > 0 && !roles.includes(payload.role)) {
        return res.status(403).json({ message: "forbidden" })
      }
      req.user = payload
      next()
    } catch (e) {
      return res.status(401).json({ message: "invalid token" })
    }
  }
}
