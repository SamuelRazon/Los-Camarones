// Se define la ruta para subir documentos y se importa el controlador 
const express = require('express');
const multer = require('multer');
const { uploadDocument, updateDocument } = require('../controllers/documentController');
const { authMiddleware } = require('../middleware/auth');
const Document = require('../models/Document');
const default_category = require('../models/default_category');
const personalized_category = require('../models/personalized_category');

const AWS = require('aws-sdk');
const { s3 } = require('../s3');



const router = express.Router();
const upload = multer(); 

router.post('/upload', authMiddleware, upload.single('file'), uploadDocument);

router.put('/update/:id', authMiddleware, upload.single('file'), updateDocument);

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

// Endpoint para obtener todos los documentos del usuario
// Se pueden filtrar por rubro y propiedades
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id
  const { rubro, propiedades, ciclo } = req.query

  
  try {
    // Filtrar documentos por usuario
    const filtro = { 
      usuario: userId,
    };

    // Filtrar rubro
    if (rubro) {
      filtro.rubro = rubro;
    }

    // Filtrar propiedades
    if (propiedades) {
      const propiedadesRegex = new RegExp(propiedades, 'i'); // Coincidencia parcial, insensible a mayúsculas
      filtro.propiedades = { $elemMatch: { $regex: propiedadesRegex } };
    }

    let documentos = await Document.find(filtro)
    // Filtrar por ciclo
    // Si se especificó ciclo, filtra por fechas contenidas en propiedades
    if (ciclo) {
      const cicloRegex = /^(\d{4})-(A|B)$/;
      const match = ciclo.match(cicloRegex);

      if (!match) {
        return res.status(400).json({ error: 'Formato de ciclo inválido. Use el formato YYYY-A o YYYY-B.' });
      }

      const year = parseInt(match[1], 10);
      const semester = match[2];

      const startDate = semester === 'A' ? new Date(year, 0, 1) : new Date(year, 6, 1);
      const endDate = semester === 'A' ? new Date(year, 5, 30) : new Date(year, 11, 31);

      documentos = documentos.filter(doc => {
      return doc.propiedades.some(prop => {
      const date = new Date(prop);
      return !isNaN(date) && date >= startDate && date <= endDate;
    });
  });
  } 

   

    return res.status(200).json(documentos)
    
  } catch (err) {
    console.error('Error al obtener documentos:', err)
    return res.status(500).json({ error: "Error interno del servidor" })
  }

}) 

router.get('/byrubro/:id', authMiddleware, async (req, res) => {
  try {
    const userId    = req.user.id;
    const rubroType = req.query.rubro;      
    const rubroId   = req.params.id;        

    //Verificamos que sea un rubro valido
    if (![ 'rubrosDefault', 'rubrosPersonalizados' ].includes(rubroType)) {
      return res.status(400).json({ error: 'Tipo de rubro inválido' });
    }

    //Verificamos que ese rubro exista
    const categoria = rubroType === 'rubrosDefault'
      ? await default_category.findById(rubroId)
      : await personalized_category.findById(rubroId);

    if (!categoria) {
      return res.status(404).json({ error: 'Rubro no encontrado' });
    }

    const filtro = {
      usuario:    userId,
      rubro:      rubroId,
      rubroModel: rubroType
    };

    //Se busca los documentos de acuerdo a nuestro filtro armado
    const documentos = await Document.find(filtro);
    return res.status(200).json(documentos);

  } catch (err) {
    console.error('Error al encontrar los documentos de acuerdo al rubro', err);
    return res.status(500).json({ error: 'Error al buscar documentos' });
  }
});


// Endpoint para borrar archivos
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Busca el documento y verifica que pertenezca al usuario
    const document = await Document.findOne({ 
      _id: id,
      usuario: userId 
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado o no tienes permiso para eliminarlo' });
    }

    try {
      // Configurar los parametros para eliminar el archivo de S3
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: document.urldocumento.split('/').pop(),
      };

      // Eliminar el documento de S3
      await s3.deleteObject(params).promise();
      
      // Solo si se elimina correctamente de S3 se elimina de la base de datos
      await Document.findByIdAndDelete(id);
      
      res.json({ message: 'Archivo eliminado correctamente' });

    } catch (s3Error) {
      console.error('Error al eliminar archivo de S3:', s3Error);
      return res.status(500).json({ 
        error: 'Error al eliminar el archivo de S3. No se completó el borrado.' 
      });
    }

  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
    res.status(500).json({ error: 'Error al eliminar el archivo' });
  }
});



/*

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

// endpoint para restaurar documentos de la papelera
router.put('/restore/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Restaurar el documento Se elimina la fecha de la papelera
    const document = await Document.findByIdAndUpdate(
      id,
      { fechadepapelera: null },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    res.json({ message: 'Documento restaurado', document });
  } catch (error) {
    console.error('Error al restaurar el documento:', error);
    res.status(500).json({ error: 'Error al restaurar el documento' });
  }
});

*/

module.exports = router;