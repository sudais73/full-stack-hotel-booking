import express from 'express'
import { getUserData, login, signup, storeRecentSearchedCities } from '../controller/userController.js'
import authMiddleware from '../middleware/Auth.js'
const userRouter = express.Router()
userRouter.post("/login", login)
userRouter.post("/signup", signup)
userRouter.get("/user-data", authMiddleware, getUserData)
userRouter.post("/recent-sc", authMiddleware, storeRecentSearchedCities)

export default userRouter