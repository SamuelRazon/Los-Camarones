// logica para recibir el archivo y guardarlo en S3 y guardar la info en Mongo
const { uploadFile } = require('../s3');
const Document = require('../models/Document');

const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    const { rubro } = req.body;
    const userId = req.user.id; 

    const result = await uploadFile(file);

    const newDoc = new Document({
      user: userId,
      rubro,
      s3Url: result.Location,
      fileName: file.originalname
    });

    await newDoc.save();

    res.status(200).json({ message: 'Archivo subido correctamente', document: newDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir el archivo' });
  }
};

module.exports = { uploadDocument };