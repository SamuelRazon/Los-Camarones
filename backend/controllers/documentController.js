const { uploadFile } = require('../s3');
const Document = require('../models/Document');

const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    const {
      rubro,
      rubroModel,
      propiedadesnombre,
      propiedades
    } = req.body;
    const usuarioId = req.user.id;

    // Validaciones básicas
    if (!rubro || !rubroModel || !propiedadesnombre || !propiedades) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Crear el objeto del nuevo documento
    const docData = {
      usuario: usuarioId,
      rubro,
      rubroModel,
      propiedadesnombre: JSON.parse(propiedadesnombre),
      propiedades: JSON.parse(propiedades)
    };

    // Si existe un archivo, se sube al s3, si no, simplemente se pone que no se adjunto nada
    if (file) {
      const result = await uploadFile(file);
      docData.urldocumento = result.Location;
      docData.adjunto = true;
    } else {
      docData.adjunto = false;
    }

    // Crear y guardar el documento
    const newDoc = new Document(docData);
    await newDoc.save();

    res.status(201).json({ message: 'Documento subido correctamente', document: newDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir el documento' });
  }
};

module.exports = { uploadDocument };
