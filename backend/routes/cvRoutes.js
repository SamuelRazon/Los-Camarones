const express = require('express');
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const { authMiddleware } = require('../middleware/auth');
const AWS = require('aws-sdk');
const router = express.Router();
const qrcode = require('qrcode');

// Configuración de AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Genera una URL firmada de S3 con una duración extendida (1 semana)
 * @param {string} documentId - ID del documento para generar la URL
 * @returns {Promise<string>} - URL firmada para acceso directo al documento
 */
async function generateLongTermSignedUrl(documentId) {
  try {
    // Buscar el documento en la base de datos
    const document = await Document.findById(documentId);
    
    if (!document || !document.urldocumento) {
      throw new Error('Documento no encontrado o sin URL válida');
    }
    
    // Extraer el nombre del archivo (Key) desde la URL almacenada
    const urlParts = document.urldocumento.split('/');
    const fileKey = urlParts[urlParts.length - 1];
    const decodedKey = decodeURIComponent(fileKey);

    // Configurar los parámetros para la URL firmada
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: decodedKey,
      Expires: 604800 // 7 días en segundos (60 * 60 * 24 * 7)
    };
    
    // Generar la URL firmada con duración extendida
    const signedUrl = s3.getSignedUrl('getObject', params);
    
    return signedUrl;
  } catch (error) {
    console.error('Error al generar URL firmada de larga duración:', error);
    throw error;
  }
}

/**
 * Función para generar un QR a partir de una URL
 * @param {string} url - La URL que se codificará en el QR
 * @returns {Promise<Buffer>} - Buffer con la imagen del QR generada
 */
async function generateQR(url) {
  try {
    // Opciones para el QR
    const options = {
      type: 'png',
      quality: 0.92,
      margin: 1,
      width: 200, // Tamaño del QR
      color: {
        dark: '#000000', // Color del QR
        light: '#ffffff' // Color de fondo
      }
    };
    
    // Generar el QR como un Buffer
    return new Promise((resolve, reject) => {
      qrcode.toBuffer(url, options, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  } catch (error) {
    console.error('Error al generar el QR:', error);
    throw error;
  }
}




// Endpoint para generar el PDF
router.post('/generate', authMiddleware ,async (req, res) => {
  try {
    const { ids } = req.body;
    const  userId  = req.user.id

    const fechaActual = new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar una lista de IDs.' });
    }

    const documentos = await Document.find({ _id: { $in: ids }, usuario: userId }).lean();

    if (documentos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron documentos.' });
    }

    // Preprocesar cada documento: obtener URL firmada y QR (si aplica)
    const documentosProcesados = await Promise.all(documentos.map(async (docData) => {
      let signedUrl = null;
      let qrBuffer = null;

      if (docData.adjunto) {
        signedUrl = await generateLongTermSignedUrl(docData._id);
        qrBuffer = await generateQR(signedUrl);
      }

      return {
        ...docData,
        signedUrl,
        qrBuffer
      };
    }));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=documentos.pdf');

    const doc = new PDFDocument();

    doc.pipe(res); // envía directamente el PDF como respuesta

    doc.fontSize(20).text('Resumen', { align: 'left' }).moveDown();
    doc.fontSize(14).text(`${fechaActual}`)

    documentosProcesados.forEach((docData, i) => {
      doc.moveDown().moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown();

      doc.fontSize(12);
      docData.propiedadesnombre.forEach((nombre, i) => {
        doc.text(`${nombre}: ${docData.propiedades[i]}`);
      });

      // Insertar QR y URL firmada si el documento tiene un adjunto
      if (docData.adjunto && docData.signedUrl) {
        doc.moveDown();
        doc.text(`Documento: `);
        if (docData.qrBuffer) {
          doc.image(docData.qrBuffer, { width: 100, height: 100 });
        }
        doc.fontSize(10).fillColor('blue').text('Descargar documento', {
          link: docData.signedUrl,
          underline: true
        });
      }
      doc.moveDown();
    });

    doc.end(); // Finaliza el PDF

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar el PDF.' });
  }
});

  module.exports = router;