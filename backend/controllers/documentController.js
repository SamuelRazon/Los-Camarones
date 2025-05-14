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
    res.status(500).json({ error: 'Error al subir el documento' });
  }  
};

const updateDocument = async (req, res) => {
  try {
    const { id } = req.params; // ID del documento a actualizar
    const file = req.file;
    const {
      rubro,
      rubroModel,
      propiedadesnombre,
      propiedades
    } = req.body;

   

    // Buscar el documento por ID
    const existingDoc = await Document.findById(id);
    if (!existingDoc) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    // Verificar que el usuario tenga permisos para modificar el documento
    if (existingDoc.usuario.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permisos para modificar este documento' });
    }
    
    // Actualizar campos si vienen en la solicitud
    if (rubro) existingDoc.rubro = rubro;
    if (rubroModel) existingDoc.rubroModel = rubroModel;
    if (propiedadesnombre) existingDoc.propiedadesnombre = JSON.parse(propiedadesnombre);
    if (propiedades) existingDoc.propiedades = JSON.parse(propiedades);

    // Si se sube un nuevo archivo, subirlo a S3 y actualizar la URL
    if (file) {
      const result = await uploadFile(file);
      existingDoc.urldocumento = result.Location;
      existingDoc.adjunto = true;
    }

    // Guardar los cambios
    await existingDoc.save();

    res.status(200).json({ message: 'Documento actualizado correctamente', document: existingDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el documento' });
  }
};

module.exports = { updateDocument, uploadDocument };
