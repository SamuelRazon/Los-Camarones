const express = require('express')
const mongoose = require('mongoose')
const RubroPersonalizado = require('../models/personalized_category')
const Usuario = require('../models/User');
const Document = require('../models/Document');
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// Crear un nuevo rubro personalizado
router.post('/', authMiddleware, async (req, res) => {
  const { nombre, propiedades, propiedadtipo, propiedadobligatorio } = req.body

  /* Este if se asegura que los espacios de dichas propiedades si tengan algun contenido */
  if (!nombre || !Array.isArray(propiedades) || propiedades.length === 0 ||
      !Array.isArray(propiedadtipo) || !Array.isArray(propiedadobligatorio)) {
    return res.status(400).json({ error: 'Nombre y propiedades son requeridos' })
  }

  /* Este if se asegura que los arrays propiedades tengan la misma cantidad de indices */
  if (propiedades.length !== propiedadtipo.length || propiedades.length !== propiedadobligatorio.length) {
    return res.status(400).json({ error: 'Los arrays propiedades, propiedadtipo y propiedadobligatorio deben tener la misma longitud' });
  }

  try {
    const nuevoRubro = new RubroPersonalizado({
      usuarioId: req.user.id,
      nombre,
      propiedades,
      propiedadtipo,
      propiedadobligatorio
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
  const { nombre, propiedades, propiedadtipo, propiedadobligatorio } = req.body

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const rubro = await RubroPersonalizado.findOne({ _id: req.params.id, usuarioId: req.user.id })
    if (!rubro) return res.status(404).json({ error: 'Rubro no encontrado' })

    rubro.nombre = nombre || rubro.nombre
    rubro.propiedades = propiedades || rubro.propiedades
    rubro.propiedadtipo = propiedadtipo || rubro.propiedadtipo
    rubro.propiedadobligatorio = propiedadobligatorio || rubro.propiedadobligatorio
    const rubroActualizado = await rubro.save()
    res.json(rubroActualizado)
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando el rubro personalizado' })
  }
})


// Eliminar un rubro personalizado (con borrado en cascada manual)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  /* Sesion para en caso de que haya un error, no se realice el eliminado */
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1) Borrar el rubro
    const rubro = await RubroPersonalizado.findOneAndDelete(
      { _id: req.params.id, usuarioId: req.user.id },
      { session }
    );
    if (!rubro) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Rubro no encontrado' });
    }

    // 2) Borrar todos los documentos que apunten a ese rubro
    await Document.deleteMany(
      { rubro: req.params.id, usuario: req.user.id },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Rubro y documentos relacionados eliminados con éxito' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el rubro personalizado' });
  }
});



// Verificar si existe un rubro con el mismo nombre (personalizado o default) para el usuario autenticado
router.get('/exists/:nombre', authMiddleware, async (req, res) => {
  const nombreBuscado = req.params.nombre.trim().toLowerCase();

  try {
    const usuario = await Usuario.findById(req.user.id)
      .populate('rubrosPersonalizados')
      .populate('rubrosDefault');

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const existeEnPersonalizados = usuario.rubrosPersonalizados.some(
      rubro => rubro.nombre.trim().toLowerCase() === nombreBuscado
    );

    const existeEnDefault = usuario.rubrosDefault.some(
      rubro => rubro.nombre.trim().toLowerCase() === nombreBuscado
    );

    const existe = existeEnPersonalizados || existeEnDefault;

    res.json({ existe });
  } catch (error) {
    res.status(500).json({ error: 'Error verificando existencia del rubro' });
  }
});


module.exports = router
