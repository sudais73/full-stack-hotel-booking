import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js'

import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controller/clerkWebhooks.js'
connectDB()
const app = express()
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

// api to listen clerk webhook//
app.use("api/clerk", clerkWebhooks)


app.get('/', (req,res)=>{
    res.send("Api is working fine")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`server is listening to port ${PORT}`))
