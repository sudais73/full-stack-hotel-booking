import express from 'express'
import authMiddleware from '../middleware/Auth.js'
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from '../controller/roomController.js'
import upload from '../middleware/uploadMiddleware.js'
const roomRouter = express.Router()

roomRouter.post('/add', upload.array("images", 4), authMiddleware, createRoom)
roomRouter.get('/get-room', getRooms)
roomRouter.get('/owner', authMiddleware, getOwnerRooms)
roomRouter.post('/toggle', authMiddleware, toggleRoomAvailability)
export default roomRouter