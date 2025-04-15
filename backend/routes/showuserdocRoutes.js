const express = require('express');
const Document = require('../models/Document');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/documents/:rubroModel', authMiddleware, async (req, res) => {
  try {
    const { rubroModel } = req.params;

    // Validacion para asegurarnos que no se creo una coleccion nueva por alguna extraña razon
    if (!['rubrosDefault', 'rubrosPersonalizados'].includes(rubroModel)) {
      return res.status(400).json({ error: 'Tipo de rubro inválido' });
    }

    /* Se buscan documentos que pertecen al usuario, filtrando por el usuario id y el rubromodel */
    const documents = await Document.find({
      usuario: req.user.id,
      rubroModel: rubroModel
    });

    return res.status(200).json({ documents });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener los documentos' });
  }
});

module.exports = router;
