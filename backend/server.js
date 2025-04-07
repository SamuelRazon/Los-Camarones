const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const perCatRoutes = require('./routes/perCatRoutes')
const documentRoutes = require('./routes/docRoutes'); // Importa las rutas de documentos

dotenv.config()
connectDB()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/perCat', perCatRoutes)
app.use('/api/documents', documentRoutes); // Registra las rutas

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server online in ${PORT}`))



