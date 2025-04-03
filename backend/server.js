const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const perCatRoutes = require('./routes/perCatRoutes')

dotenv.config()
connectDB()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/perCat', perCatRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server online in ${PORT}`))
