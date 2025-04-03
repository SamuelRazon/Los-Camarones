const express = require('express')
const RubroPersonalizado = require('../models/personalized_category')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// Crear un nuevo rubro personalizado
router.post('/', authMiddleware, async (req, res) => {
  const { nombre, propiedades } = req.body

  if (!nombre || !Array.isArray(propiedades) || propiedades.length === 0) {
    return res.status(400).json({ error: 'Nombre y propiedades son requeridos' })
  }

  try {
    const nuevoRubro = new RubroPersonalizado({
      usuarioId: req.user.id,
      nombre,
      propiedades
    })
    const rubroGuardado = await nuevoRubro.save()
    res.status(201).json(rubroGuardado)
  } catch (error) {
    res.status(500).json({ error: 'Error creando el rubro personalizado' })
  }
})

// Obtener todos los rubros personalizados del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rubros = await RubroPersonalizado.find({ usuarioId: req.user.id })
    res.json(rubros)
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo los rubros personalizados' })
  }
})

// Actualizar un rubro personalizado PREFERENTEMENT NO USAR O NOS METEMOS EN PEDOS, igual hay queda por si llegara a hacer falta
router.put('/:id', authMiddleware, async (req, res) => {
  const { nombre, propiedades } = req.body

  try {
    const rubro = await RubroPersonalizado.findOne({ _id: req.params.id, usuarioId: req.user.id })
    if (!rubro) return res.status(404).json({ error: 'Rubro no encontrado' })

    rubro.nombre = nombre || rubro.nombre
    rubro.propiedades = propiedades || rubro.propiedades
    const rubroActualizado = await rubro.save()
    res.json(rubroActualizado)
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando el rubro personalizado' })
  }
})

// Eliminar un rubro personalizado
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const rubro = await RubroPersonalizado.findOneAndDelete({ _id: req.params.id, usuarioId: req.user.id })
    if (!rubro) return res.status(404).json({ error: 'Rubro no encontrado' })
    res.json({ message: 'Rubro eliminado con éxito' })
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando el rubro personalizado' })
  }
})

module.exports = router
