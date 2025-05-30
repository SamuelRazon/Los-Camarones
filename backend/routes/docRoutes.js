// Se define la ruta para subir documentos y se importa el controlador 
const express = require('express');
const multer = require('multer');
const { uploadDocument, updateDocument } = require('../controllers/documentController');
const { authMiddleware } = require('../middleware/auth');
const Document = require('../models/Document');
const User = require('../models/User')
const archiver = require('archiver');
const path = require('path');
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
  const { rubro, propiedades, ciclo , startDate, endDate } = req.query

  
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

    // Verificar que no se combinen ciclo y fechas
    if (ciclo && (startDate || endDate)) {
      return res.status(400).json({ error: 'No se pueden combinar ciclo y fechas de inicio/fin.' });
    }


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

      const startDateC = semester === 'A' ? new Date(year, 0, 1) : new Date(year, 6, 1);
      const endDateC = semester === 'A' ? new Date(year, 5, 30) : new Date(year, 11, 31);

      documentos = documentos.filter(doc => {
        return doc.propiedades.some(prop => {
          const date = new Date(prop);
          return !isNaN(date) && date >= startDateC && date <= endDateC;
        });
      });
    } 

  if (startDate || endDate) {
    // Verficar formato de fecha valido
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (startDate && !dateRegex.test(startDate)) {
      return res.status(400).json({ error: 'Formato de fecha de inicio inválido. Use el formato YYYY-MM-DD.' });
    }
    if (endDate && !dateRegex.test(endDate)) {
      return res.status(400).json({ error: 'Formato de fecha de fin inválido. Use el formato YYYY-MM-DD.' });
    }

    // Filtrar por fechas
    const start = startDate ? new Date(startDate) : new Date(0); // Fecha mínima
    const end = endDate ? new Date(endDate) : new Date(); // Fecha máxima
    documentos = documentos.filter(doc => {
      return doc.propiedades.some(prop => {
        const date = new Date(prop);
        return !isNaN(date) && date >= start && date <= end;
      });
    }
    );
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

    // Si existe un archivo en S3, intentar borrarlo
    if (document.urldocumento) {
      try {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: document.urldocumento.split('/').pop(),
        };

        await s3.deleteObject(params).promise();
      } catch (s3Error) {
        console.error('Error al eliminar archivo de S3:', s3Error);
        // Continua con el proceso para borrar el registro de la BD
      }
    }

    // Eliminar el documento de la base de datos
    await Document.findByIdAndDelete(id);
    
    res.json({ message: 'Documento eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar el documento:', error);
    res.status(500).json({ error: 'Error al eliminar el documento' });
  }
});

/* Empaqueta en un ZIP todos los documentos de un usuario
   en carpetas por cada categoría (default y personalizada). */
  router.get('/export_zip', authMiddleware, async (req, res) => {
    const userId = req.user.id;
  
    try {
      // 1. Verificar usuario
      const usuario = await User.findById(userId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const defaultIds = usuario.rubrosDefault       || [];
      const customIds  = usuario.rubrosPersonalizados || [];
  
      // 2. Recuperar categorías
      const [defaultCats, customCats] = await Promise.all([
        default_category.find({ _id: { $in: defaultIds } }),
        personalized_category.find({ _id: { $in: customIds } })
      ]);
  
      // 3. Cabeceras para descarga del ZIP
      res.setHeader('Content-Type',  'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${usuario.username || 'export'}_documents.zip`
      );
  
      // 4. Crear ZIP y pipe al response
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.on('error', err => {
        console.error('Error del ZIP:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error al crear el ZIP', detalle: err.message });
        } else {
          res.end();
        }
      });
      archive.on('warning', warning => console.warn(warning));
      archive.pipe(res);
  
      // 5. Función auxiliar para cada categoría
      const addDocs = async (cat, modelName) => {
        try{
          const docs = await Document.find({
            rubro:      cat._id,
            rubroModel: modelName,
            usuario:    userId
          });
    
          for (const doc of docs) {
            if (!doc.adjunto) continue;
    
            // Extraer la key del objeto S3
            const key = decodeURIComponent(path.basename(doc.urldocumento));
    
            // Construir el nombre de descarga
            let filename = key;
            if (doc.propiedadesnombre.includes('nombre')) {
              const idx  = doc.propiedadesnombre.indexOf('nombre');
              const base = `${doc.propiedades[idx]}`.trim();
              filename = base.toLowerCase().endsWith('.pdf')
                ? base
                : `${base}.pdf`;
            }
    
            // Obtener el stream directamente desde S3
            const s3Stream = s3.getObject({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key:    key
            }).createReadStream();

            s3Stream.on('error', err => {
              console.error(`Error al obtener ${key} de S3:`, err);
              archive.append('Error al obtener archivo\n', { name: `${cat.nombre}/ERROR_${filename}` });
            });
    
            // Añadir al ZIP dentro de la carpeta de la categoría
            archive.append(s3Stream, {
              name: `${cat.nombre}/${filename}`
            });
          }
        } catch (err) {
          console.error(`Error al procesar documentos de ${cat.nombre}:`, err);
        }
      };
  
      // 6. Recorrer default y personalizado
      for (const cat of defaultCats) {
        await addDocs(cat, 'rubrosDefault');
      }
      for (const cat of customCats) {
        await addDocs(cat, 'rubrosPersonalizados');
      }
  
      // 7. Finalizar el ZIP (esto dispara el envío)
      await archive.finalize();
  
    } catch (err) {
      console.error('Error export_zip:', err);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Error al crear el ZIP' });
      }
      // Si ya empezó el stream, simplemente lo cerramos
      res.end();
    }
  });


// Mover a papelera
router.put('/trash/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const document = await Document.findOneAndUpdate(
      { _id: id, usuario: userId },
      { enPapelera: true },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    res.json({ message: 'Documento movido a la papelera', document });
  } catch (error) {
    res.status(500).json({ error: 'Error al mover el documento a la papelera' });
  }
});

/*
// Listar documentos en papelera
router.get('/trash', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({
      usuario: req.user.id,
      enPapelera: true
    });

    res.json({ documents });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener documentos en la papelera' });
  }
});
*/

// Restaurar de papelera
router.put('/restore/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const document = await Document.findOneAndUpdate(
      { _id: id, usuario: userId },
      { enPapelera: false },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    res.json({ message: 'Documento restaurado', document });
  } catch (error) {
    res.status(500).json({ error: 'Error al restaurar el documento' });
  }
});

module.exports = router;