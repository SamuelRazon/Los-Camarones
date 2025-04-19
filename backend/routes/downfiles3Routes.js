const express = require('express');
const { s3 } = require('../s3');
const Document = require('../models/Document');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/* Se ocupa la id del documento para acceder a el */
router.get('/download/:docId', authMiddleware, async (req, res) => {
  try {
    const { docId } = req.params;
    const document = await Document.findById(docId);

    /* Error 404 por si el documento no existe, y 403 por si un usuario por alguna razon llega a tener acceso a el */
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    if (document.usuario.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado para descargar este documento' });
    }
    if (document.adjunto === false) {
      return res.status(400).json({ error: 'Este documento no tiene ningún archivo adjunto' });
    } //Esta validacion se supone que nunca deberia de pasar
    if (document.fechadepapelera !== null){
      return res.status(409).json({ error: 'Existe un conflicto interno de acuerdo a tu peticion' });
    }
        
    /* Obtener la key del archivo
    * La key en pocas palabras es el nombre interno que tiene el archivo dentro del bucket de s3
    * Tipo
    * La url que esta guardada en mongo es https://mi-bucket.s3.amazonaws.com/123e4567-miarchivito.pdf
    * El nombre interno del archivo seria 123e4567-miarchivito.pdf
    * Por cierto, podriamos guardar dentro del mismo documento la key como un atributo, pero ustedes digan
    *  */
    const urlParts = document.urldocumento.split('/');
    const fileKey = urlParts[urlParts.length - 1];


    /* Creamos una signed URL para que solamente nuestro usuario pueda descargar el archivo
    * El tiempo que durara esa url sera de 60 segundos, pero si quieren menos o mas cambien el Expires*/
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Expires: 60
    };


    const downloadUrl = s3.getSignedUrl('getObject', params);
    return res.status(200).json({ downloadUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al descargar el documento' });
  }
});

module.exports = router;
