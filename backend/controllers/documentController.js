// Lógica para recibir el archivo, guardarlo en S3 y almacenar toda la info en Mongo
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
    if (!rubro || !rubroModel || !propiedadesnombre || !propiedades || !file) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o archivo' });
    }

    // Subir el archivo a S3
    const result = await uploadFile(file);

    // Crear nuevo documento
    const newDoc = new Document({
      usuarioId,
      rubro,
      rubroModel,
      propiedadesnombre: JSON.parse(propiedadesnombre), 
      propiedades: JSON.parse(propiedades), /* Las propiedades deben ser en string */
      urldocumento: result.Location,
      adjunto: true // Se demuestra que si existe un archivo subido
    });

    await newDoc.save();

    res.status(201).json({ message: 'Documento subido correctamente', document: newDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir el documento' });
  }
};

module.exports = { uploadDocument };