// Se define la ruta para subir documentos y se importa el controlador 
const express = require('express');
const multer = require('multer');
const { uploadDocument } = require('../controllers/documentController');
const { authMiddleware } = require('../middleware/auth');
const Document = require('../models/Document');

const AWS = require('aws-sdk');




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
    const filtro = {
      usuario: userId,
      fechadepapelera: null
    };

    const documentos = await Document.find(filtro)

    return res.status(200).json(documentos)
    
  } catch (err) {
    return res.status(500).json({ error: "Error interno del servidor" })
  }

}) 


// Endpoint para borrar archivos
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Busca el documento en la base de datos
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    // Configurar los parametros para eliminar el archivo de S3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: document.urldocumento.split('/').pop(), // Extraer el nombre url
    };

    // Eliminar el documento de S3
    await s3.deleteObject(params).promise();

    // Eliminar el documento de la base de datos
    await Document.findByIdAndDelete(id);

    res.json({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
    res.status(500).json({ error: 'Error al eliminar el archivo' });
  }
});


// endpoint para mover documentos a la papelera
router.put('/trash/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Marca el documento como eliminado y registra la fecha de la papelera
    const document = await Document.findByIdAndUpdate(
      id,
      { fechadepapelera: new Date() },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    res.json({ message: 'Documento movido a la papelera', document });
  } catch (error) {
    console.error('Error al mover el documento a la papelera:', error);
    res.status(500).json({ error: 'Error al mover el documento a la papelera' });
  }
});

// endpoint para listar documentos en la papelera
router.get('/trash', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({
      usuario: req.user.id,
      fechadepapelera: { $ne: null }, 
    });

    res.json({ documents });
  } catch (error) {
    console.error('Error al obtener documentos en la papelera:', error);
    res.status(500).json({ error: 'Error al obtener documentos en la papelera' });
  }
});


module.exports = router;