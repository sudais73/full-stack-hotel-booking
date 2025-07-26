import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js'
import userRouter from './routes/user.js'
import hotelRouter from './routes/hotel.js'
import cloudinaryConfig from './config/cloudinary.js'
import roomRouter from './routes/room.js'
import bookRouter from './routes/booking.js'

connectDB()
cloudinaryConfig()
const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/user", userRouter)
app.use("/api/hotel", hotelRouter)
app.use("/api/room", roomRouter)
app.use("/api/booking", bookRouter)

app.get('/', (req,res)=>{
    res.send("Api is working fine")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`server is listening to port ${PORT}`))
