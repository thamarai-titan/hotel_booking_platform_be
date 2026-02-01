import express from 'express'
import cors from 'cors'
import authRoute from './routes/auth.route.ts'

const PORT = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoute)

app.listen(PORT, ()=>{
    console.log(`Server Running on ${PORT}`)
})