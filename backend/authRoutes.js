const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

// Registro
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: 'Usuario registrado con exito' })
  } catch (error) {
    res.status(500).json({ error: 'Error registrando usuario' })
  }
})

// Inicio de sesion
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ error: 'Contraseña no valida' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } })
  } catch (error) {
    res.status(500).json({ error: 'Error en el inicio de sesion' })
  }
})

// Validar token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')
  if (!token) return res.status(401).json({ error: 'Accesos denegado' })

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (error) {
    res.status(400).josn({ error: 'Token invalido' })
  }
}

// Ruta protegida
router.get('/perfil', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  res.json(user)
})

module.exports = router
