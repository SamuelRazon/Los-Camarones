const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/User')
const RubroPersonalizado = require('../models/personalized_category')

const router = express.Router()

// Registro
router.post('/register', async (req, res) => {
  const { username, email, password, foto, customRubro } = req.body

  try {
    // Validación básica de datos requeridos
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Se crea el usuario usando los campos del modelo:
    // - correo: a partir de email
    // - contraseña: password hasheado
    // - username: de req.body
    // - foto: opcional (se envía o se asigna cadena vacía)
    // - rubrosDefault: inicialmente se deja vacío (ya que se trabajarán de forma predefinida)
    // - rubrosPersonalizados: se llenará si el usuario crea alguno
    const nuevoUsuario = new Usuario({
      username,
      correo: email,
      contraseña: hashedPassword,
      foto: foto || '',
      rubrosDefault: [],
      rubrosPersonalizados: []
    })

    try {
      await nuevoUsuario.save()
      console.log('Usuario guardado con éxito')
    } catch (err) {
      console.error('Error al guardar:', err)
      if (err.code === 11000 && err.keyPattern && err.keyPattern.correo) {
        return res.status(400).json({ error: 'El correo ya está registrado' })
      }
      return res.status(500).json({ error: 'Error registrando usuario' })
    }

    // Si se envía un objeto customRubro, se crea el rubro personalizado
    if (
      customRubro &&
      customRubro.nombre &&
      Array.isArray(customRubro.propiedades) &&
      customRubro.propiedades.length > 0
    ) {
      const nuevoRubroPersonalizado = new RubroPersonalizado({
        usuarioId: nuevoUsuario._id,
        nombre: customRubro.nombre,
        // La fecha se asigna automáticamente con default: Date.now
        propiedades: customRubro.propiedades
      })

      const rubroGuardado = await nuevoRubroPersonalizado.save()

      // Se actualiza el usuario para incluir el nuevo rubro personalizado
      nuevoUsuario.rubrosPersonalizados.push(rubroGuardado._id)
      await nuevoUsuario.save()
    }

    res.status(201).json({ message: 'Usuario registrado con éxito' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error registrando usuario' })
  }
})

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const usuario = await Usuario.findOne({ correo: email })
    if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' })

    const isMatch = await bcrypt.compare(password, usuario.contraseña)
    if (!isMatch) return res.status(400).json({ error: 'Contraseña no válida' })

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.json({
      token,
      user: {
        id: usuario._id,
        username: usuario.username,
        correo: usuario.correo
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error en el inicio de sesión' })
  }
})

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')
  if (!token) return res.status(401).json({ error: 'Acceso denegado' })

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (error) {
    res.status(400).json({ error: 'Token inválido' })
  }
}

// Ruta protegida para obtener el perfil del usuario
router.get('/perfil', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id)
      .select('-contraseña')
      .populate('rubrosPersonalizados')
    res.json(usuario)
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo el perfil' })
  }
})

module.exports = router
