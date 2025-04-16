// Se define la ruta para subir documentos y se importa el controlador 
const express = require('express');
const multer = require('multer');
const { uploadDocument } = require('../controllers/documentController');
const { authMiddleware } = require('../middleware/auth');
const Document = require('../models/Document');


const router = express.Router();
const upload = multer(); 

router.post('/upload', authMiddleware, upload.single('file'), uploadDocument);

router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  const  userId  = req.user.id
  try{
    const documento = await Document.findOne({ _id: id, usuario: userId })
    if (!documento) return res.status(404).json({ error: 'Documento no encontrado' })

    res.json(documento)
  } catch (err) {
    res.status(500).json({ error: "Error del servidor"})
  }
})

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id
  const { rubro } = req.query

  
  try {
    const filtro = { usuario: userId}
    if (rubro){
      filtro.rubro = rubro
    }

    const documentos = await Document.find(filtro)

    return res.status(200).json(documentos)
    
  } catch (err) {
    return res.status(500).json({ error: "Error interno del servidor" })
  }

}) 

module.exports = router;