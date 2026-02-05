import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.route.ts'
import hotelRoutes from './routes/hotels.route.ts'
import bookingAuth from './routes/bookings.route.ts'
import reviewAuth from './routes/reviews.auth.ts'

const PORT = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api", hotelRoutes)
app.use("/api", bookingAuth)
app.use("/api", reviewAuth)

app.listen(PORT, ()=>{
    console.log(`Server Running on ${PORT}`)
})