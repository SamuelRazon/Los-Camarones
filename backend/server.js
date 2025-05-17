const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const perCatRoutes = require('./routes/perCatRoutes')
const documentRoutes = require('./routes/docRoutes'); // Importa las rutas de documentos
const getCatRoutes = require('./routes/userCatRoutes');
const downfilesRoutes = require('./routes/downfiles3Routes');
const showuserdocRoutes = require('./routes/showuserdocRoutes');
const cvRoutes = require('./routes/cvRoutes')



dotenv.config()
connectDB()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/perCat', perCatRoutes)
app.use('/api/documents', documentRoutes); // Registra las rutas
app.use('/api/cats', getCatRoutes); // Registra las rutas
app.use('/api/cats', downfilesRoutes);
app.use('/api/cats', showuserdocRoutes);
app.use('/api/cv', cvRoutes);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server online in ${PORT}`))

