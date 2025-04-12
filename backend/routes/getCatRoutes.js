const express = require('express');
const Usuario = require('../models/User');
const RubroPersonalizado = require('../models/personalized_category')
const RubroDefault = require('../models/default_category')

const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/mycategories', authMiddleware, async (req, res) => {
  try {
    // Encontramos al usuario y poblamos los arrays de rubros
    const usuario = await Usuario.findById(req.user.id)
      .populate('rubrosPersonalizados')  
      .populate('rubrosDefault');
      
      /* El metodo populate intercambia los object id que tenemos guardados dentro de los arrays 
         rubrosdefault y personalizados por los documentos completos que corresponden a ese object id */

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    /* Mapeo de todos los atributos de cada coleccion*/
    const rubrosPersonalizados = (usuario.rubrosPersonalizados || []).map(rubro => ({
      id: rubro._id,
      nombre: rubro.nombre,
      propiedades: rubro.propiedades,
      propiedadtipo: rubro.propiedadtipo,
      propiedadesobligatorio: rubro.propiedadesobligatorio,
    }));
    
    const rubrosDefault = (usuario.rubrosDefault || []).map(rubro => ({
      id: rubro._id,
      nombre: rubro.nombre,
      propiedades: rubro.propiedades, 
      propiedadtipo: rubro.propiedadtipo,
    }));
    

    // Esto es para enviar los datos del mapeo al frontend
    res.json({
      rubrosPersonalizados,
      rubrosDefault
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;