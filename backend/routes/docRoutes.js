// Se define la ruta para subir documentos y se importa el controlador 
const express = require('express');
const multer = require('multer');
const { uploadDocument } = require('../controllers/documentController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const upload = multer(); 

router.post('/upload', authMiddleware, upload.single('file'), uploadDocument);

module.exports = router;