import express from 'express'
import { checkAvailabilityApi, createBooking, getHotelBookings, getUserBooking, verifyBooking } from '../controller/bookingController.js'
import authMiddleware from '../middleware/Auth.js'
const bookRouter = express.Router()
bookRouter.post('/check-availability', checkAvailabilityApi)
bookRouter.post('/book', authMiddleware, createBooking)
bookRouter.get('/user', authMiddleware, getUserBooking)
bookRouter.get('/hotel', authMiddleware, getHotelBookings)
bookRouter.post('/verify', authMiddleware, verifyBooking)


export default bookRouter