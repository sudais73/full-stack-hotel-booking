import express from 'express'
import authMiddleware from '../middleware/Auth.js';
import { registerHotel } from '../controller/HotelController.js';
const hotelRouter = express.Router()

hotelRouter.post('/add', authMiddleware, registerHotel)


export default hotelRouter;