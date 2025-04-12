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

// Asignar rubros default
router.put('/default-cats/:type', authMiddleware, async (req,res) => {
  const { type } = req.params
  const usuario = await Usuario.findById(req.user.id)
  
  let rubrosID = []
  switch (type) {
    case 'investigador':
      rubrosID = [ "67eb8ab9101822e4446b1416", "67eb8ab9101822e4446b141f", "67eb8ab9101822e4446b141e", "67eb8ab9101822e4446b1417", "67eb8ab9101822e4446b141d", "67eb8ab9101822e4446b1419", "67eb8ab9101822e4446b141c", "67eb8ab9101822e4446b141a", "67eb8ab9101822e4446b1418", "67eb8ab9101822e4446b141b", "67eb8ab9101822e4446b1420" ]    
      break;
    case 'maestro':
      rubrosID = [ "67eb8ab9101822e4446b1416", "67eb8ab9101822e4446b1418", "67eb8ab9101822e4446b1419", "67eb8ab9101822e4446b1417", "67eb8ab9101822e4446b141c", "67eb8ab9101822e4446b141a" ]    
      break;
    case 'Personalizable':
      rubrosID = [ "67eb8ab9101822e4446b1416" ]    

      break;
    default:
      return res.status(400).json({ error: 'El tipo de usuario no es valido' })
      
    
  }

  try {
    const rubros = await RubroDefault.find({ _id: { $in: rubrosID } });
    if (rubros.length !== rubrosID.length) {
      return res.status(400).json({ error: 'Algunos rubros no existen' });
    }
    
    rubrosID.forEach(rubroID => {
      if (!usuario.rubrosDefault.includes(rubroID)) {
        usuario.rubrosDefault.push(rubroID);
      }
    })

    await usuario.save()
    res.status(200).json({ message: 'Rubros default añadidos correctamente', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
})

module.exports = router;