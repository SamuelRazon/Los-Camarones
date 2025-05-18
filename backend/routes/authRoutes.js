const express = require('express')
require('dotenv').config();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/User')
const RubroPersonalizado = require('../models/personalized_category')
const { authMiddleware } = require('../middleware/auth')
const router = express.Router()
const nodemailer = require('nodemailer');

const AWS = require('aws-sdk');
const Document = require('../models/Document');



// Registro
router.post('/register', async (req, res) => {
  const { username, email, password, foto, customRubro } = req.body

  try {
    // Validación básica de datos requeridos
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Se crea el usuario usando los campos del modelo:
    // - correo: a partir de email
    // - contraseña: password hasheado
    // - username: de req.body
    // - foto: opcional (se envía o se asigna cadena vacía)
    // - rubrosDefault: inicialmente se deja vacío (ya que se trabajarán de forma predefinida)
    // - rubrosPersonalizados: se llenará si el usuario crea alguno
    const nuevoUsuario = new Usuario({
      username,
      correo: email,
      contraseña: hashedPassword,
      foto: foto || '',
      rubrosDefault: [],
      rubrosPersonalizados: []
    })

    try {
      await nuevoUsuario.save()
      console.log('Usuario guardado con éxito')
    } catch (err) {
      console.error('Error al guardar:', err)
      if (err.code === 11000 && err.keyPattern && err.keyPattern.correo) {
        return res.status(409).json({ error: 'El correo ya está registrado' })
      }
      return res.status(500).json({ error: 'Error registrando usuario' })
    }

    // Si se envía un objeto customRubro, se crea el rubro personalizado
    if (
      customRubro &&
      customRubro.nombre &&
      Array.isArray(customRubro.propiedades) &&
      customRubro.propiedades.length > 0
    ) {
      const nuevoRubroPersonalizado = new RubroPersonalizado({
        usuarioId: nuevoUsuario._id,
        nombre: customRubro.nombre,
        // La fecha se asigna automáticamente con default: Date.now
        propiedades: customRubro.propiedades
      })

      const rubroGuardado = await nuevoRubroPersonalizado.save()

      // Se actualiza el usuario para incluir el nuevo rubro personalizado
      nuevoUsuario.rubrosPersonalizados.push(rubroGuardado._id)
      await nuevoUsuario.save()
    }

    res.status(201).json({ message: 'Usuario registrado con éxito' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error registrando usuario' })
  }
})

// Verificar si el correo ya está registrado
router.post('/check-email', async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo: email });
    if (usuario) {
      return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error verificando el correo' });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const usuario = await Usuario.findOne({ correo: email })
    if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' })

    const isMatch = await bcrypt.compare(password, usuario.contraseña)
    if (!isMatch) return res.status(400).json({ error: 'Contraseña no válida' })

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.json({
      token,
      user: {
        id: usuario._id,
        username: usuario.username,
        correo: usuario.correo
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error en el inicio de sesión' })
  }
})

// Autenticar un token
router.get('/', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id).select('-contraseña')
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json({ 
      message: 'Token válido',
      user: {
        id: usuario._id,
        username: usuario.username,
        correo: usuario.correo
      }
    })
  } catch (error) {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWY0OTdiNjE4YWE5NjVjYTU1NzAyNCIsImlhdCI6MTc0Mzg5MDA4OCwiZXhwIjoxNzQzODkzNjg4fQ.Xrp3BvmWOFmiAfIgXAaqSc9Lqx49AbShjHyuzVD79eU
    res.status(500).json({ error: 'Error autenticando el token' })
  }
})

// Ruta protegida para obtener el perfil del usuario
router.get('/perfil', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id)
      .select('-contraseña')
      .populate('rubrosPersonalizados')
    res.json(usuario)
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo el perfil' })
  }
})

/* Se configura por donde se enviaran los correos*/
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user:process.env.GMAIL_USER,
    pass:process.env.GMAIL_PASSWORD,
  },
});

// Ruta para envier el correo de recuperacion hacia el debido usuario
router.post('/send_validation_link', async (req, res) => {
  const { correo } = req.body;
  try {

    if (!correo) {
      return res.status(400).json({ message: 'Correo requerido.' });
    }
    console.log("Generando token...");
    // 2. Genera un JWT con expiración de 5 minutos
    const token = jwt.sign(
      { correo },               
      process.env.JWT_SECRET,    
      { expiresIn: '5m' }        
    );
   
console.log("Construyendo link...");
    // 3. Construye el enlace al formulario de reset
    const link = `${process.env.FRONTEND_URL}/validation-email?token=${token}`;
    console.log(link)

    console.log('TOKEN PARA VALIDAR:', token);

console.log("Enviando correo...");
    // 4. Envía el correo de validacion
    await transporter.sendMail({
      from: `"Shrimp Shelf" <${process.env.GMAIL_USER}>`,
      to: correo,
      subject: 'Valida tu correo electronico (válido 5 min)',
      html: `
        <p>Haz clic en el siguiente enlace para validar tu correo electronico. El enlace expirará en 5 minutos:</p>
       <p><a href="${link}">Validar Correo.</a></p>
        <p>Si no solicitaste esto, simplemente ignora este correo.</p>
      `,
    });

console.log("Correo enviado");

    return res.json({ message: 'Correo de validacion enviado. Revisa tu bandeja.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno.' });
  }
});


// Ruta para envier el correo de recuperacion hacia el debido usuario
router.post('/send_reset_link', async (req, res) => {
  const { correo } = req.body;
  try {
    console.log('GMAIL_USER=', process.env.GMAIL_USER);
    console.log('GMAIL_PASSWORD=', process.env.GMAIL_PASSWORD);
    // 1. Verifica que el usuario exista
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // 2. Genera un JWT con expiración de 5 minutos
    const payload = { sub: usuario._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });
    /* 
    // 3. Construye el enlace al formulario de reset
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log(resetLink) */

    console.log('TOKEN PARA RESETEO:', token);
    // 4. Envía el correo de recuperación
    await transporter.sendMail({
      from: `"Shrimp Shelf" <${process.env.GMAIL_USER}>`,
      to: usuario.correo,
      subject: 'Recupera tu contraseña (válido 5 min)',
      html: `
        <p>Hola ${usuario.username || ''},</p>
        <p>Haz clic en el siguiente enlace para establecer tu nueva contraseña. El enlace expirará en 5 minutos:</p>
        <p>Restablecer contraseña</p>
        <p>Si no solicitaste esto, simplemente ignora este correo.</p>
      `,
    });

    return res.json({ message: 'Correo de recuperación enviado. Revisa tu bandeja.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno.' });
  }
});

// Verificar token de recuperacion de contraseña
router.get('/verify-reset', (req, res) => {
  const { token } = req.query;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(401).json({ ok: false, message: 'Token inválido o expirado.' });
  }
});

// Resetear contraseña del usuario si y solo si el token sigue vigente
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(payload.sub);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    // Hasheamos y guardamos
    const salt = await bcrypt.genSalt(10);
    usuario.contraseña = await bcrypt.hash(newPassword, salt);
    await usuario.save();
    return res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    return res.status(400).json({ message: 'Token inválido o error en reset.' });
  }
});

// Configuración de AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Endpoint para descargar el archivo
router.get('/download/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Busca el documento en la base de datos
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    // Configurar los parametros para obtener la URL de descarga
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: document.urldocumento.split('/').pop(), // Extraer el nombre del archivo desde la URL
      Expires: 60, // La URL es valida por un minitu  creo que seria mejor borarla perolo la dejo 
    };

    // Generar la URL de descarga
    const url = s3.getSignedUrl('getObject', params);

    res.json({ downloadUrl: url });
  } catch (error) {
    console.error('Error al generar la URL de descarga:', error);
    res.status(500).json({ error: 'Error al generar la URL de descarga' });
  }
});


module.exports = router
