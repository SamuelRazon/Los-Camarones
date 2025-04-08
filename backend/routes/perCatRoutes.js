const express = require('express')
const mongoose = require('mongoose')
const RubroPersonalizado = require('../models/personalized_category')
const Usuario = require('../models/User');
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// Crear un nuevo rubro personalizado
router.post('/', authMiddleware, async (req, res) => {
  const { nombre, propiedades, propiedadtipo, propiedadesobligatorio } = req.body

  /* Este if se asegura que los espacios de dichas propiedades si tengan algun contenido */
  if (!nombre || !Array.isArray(propiedades) || propiedades.length === 0 ||
      !Array.isArray(propiedadtipo) || !Array.isArray(propiedadesobligatorio)) {
    return res.status(400).json({ error: 'Nombre y propiedades son requeridos' })
  }

  /* Este if se asegura que los arrays propiedades tengan la misma cantidad de indices */
  if (propiedades.length !== propiedadtipo.length || propiedades.length !== propiedadesobligatorio.length) {
    return res.status(400).json({ error: 'Los arrays propiedades, propiedadtipo y propiedadesobligatorio deben tener la misma longitud' });
  }

  try {
    const nuevoRubro = new RubroPersonalizado({
      usuarioId: req.user.id,
      nombre,
      propiedades,
      propiedadtipo,
      propiedadesobligatorio
    })
    const rubroGuardado = await nuevoRubro.save()

    // Actualizamos el array de rubros personalizados del usuario que creo el rubro
    await Usuario.findByIdAndUpdate(
      req.user.id,
      { $push: { rubrosPersonalizados: rubroGuardado._id } },
      { new: true }
    );
    
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

// Obtener un rubro personalizado por ID
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  try {
    const rubro = await RubroPersonalizado.findOne({ _id: id, usuarioId: req.user.id })
    if (!rubro) {
      return res.status(404).json({ error: 'Rubro no encontrado' })
    }
    res.json(rubro)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el rubro personalizado' })
  }
})


// Actualizar un rubro personalizado (Ta disponible, pero cuidadito, siento que faltan cosas)
router.put('/:id', authMiddleware, async (req, res) => {
  const { nombre, propiedades, propiedadtipo, propiedadesobligatorio } = req.body

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const rubro = await RubroPersonalizado.findOne({ _id: req.params.id, usuarioId: req.user.id })
    if (!rubro) return res.status(404).json({ error: 'Rubro no encontrado' })

    rubro.nombre = nombre || rubro.nombre
    rubro.propiedades = propiedades || rubro.propiedades
    rubro.propiedadtipo = propiedadtipo || rubro.propiedadtipo
    rubro.propiedadesobligatorio = propiedadesobligatorio || rubro.propiedadesobligatorio
    const rubroActualizado = await rubro.save()
    res.json(rubroActualizado)
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando el rubro personalizado' })
  }
})

// Eliminar un rubro personalizado
router.delete('/:id', authMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const rubro = await RubroPersonalizado.findOneAndDelete({ _id: req.params.id, usuarioId: req.user.id })
    if (!rubro) return res.status(404).json({ error: 'Rubro no encontrado' })
    res.json({ message: 'Rubro eliminado con éxito' })
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando el rubro personalizado' })
  }
})

module.exports = router
