const express = require('express');
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

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

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=documentos.pdf');

    const doc = new PDFDocument();

    doc.pipe(res); // envía directamente el PDF como respuesta

    doc.fontSize(20).text('Resumen', { align: 'left' }).moveDown();
    doc.fontSize(14).text(`${fechaActual}`)

    documentos.forEach((docData, index) => {
      doc.moveDown().moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown();

      doc.fontSize(12);
      docData.propiedadesnombre.forEach((nombre, i) => {
        doc.text(`${nombre}: ${docData.propiedades[i]}`);
      });
      doc.moveDown();
    });

    doc.end(); // Finaliza el PDF

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar el PDF.' });
  }
});

  module.exports = router;