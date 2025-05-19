const express = require('express')
require('dotenv').config();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/User')
const RubroPersonalizado = require('../models/personalized_category')
const RubroDefault = require('../models/default_category')
const { authMiddleware } = require('../middleware/auth')
const router = express.Router()
const nodemailer = require('nodemailer');

const AWS = require('aws-sdk');
const Document = require('../models/Document');


/* Ruta para registrar un usuario a traves del link de un email */
router.get('/validate-email', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Token requerido.');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).send('Token inválido o expirado.');
  }

  //Crea el usuario con los datos del payload
  const nuevoUsuario = new Usuario({
    correo:          payload.correo,
    username:        payload.username,
    contraseña:      payload.hashedPassword,
    foto:            '',
    rubrosDefault:   [],
    rubrosPersonalizados: [],
  });
  try {
    await nuevoUsuario.save();
  } catch (err) {
    console.error(err); 
    return res.status(500).send('Error interno al guardar usuario.');
  }

  /*try {
    // IDs de los rubros default que se deben copiar
    const rubroDefaultIds = [
      "67eb8ab9101822e4446b1416",
      "67eb8ab9101822e4446b1418",
      "67eb8ab9101822e4446b1419",
      "67eb8ab9101822e4446b1417",
      "67eb8ab9101822e4446b141c",
      "67eb8ab9101822e4446b141a",
    ];

    // Obtener los rubros default correspondientes
    const rubrosDefault = await RubroDefault.find({ _id: { $in: rubroDefaultIds } });

    // Crear copias de los rubros default en rubros personalizados
    const rubrosPersonalizados = rubrosDefault.map((rubro) => ({
      usuarioId: nuevoUsuario._id,
      nombre: rubro.nombre,
      propiedades: rubro.propiedades,
      propiedadtipo: rubro.propiedadtipo,
      propiedadobligatorio: rubro.propiedadobligatorio,
    }));

    console.log(rubrosPersonalizados);

    // Guardar los nuevos rubros personalizados
    await RubroPersonalizado.insertMany(rubrosPersonalizados,{ ordered: true });

  
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error interno al guardar rubros personalizados.');
  }

*/
  // Rederigimos al frontend
  return res.redirect(`${process.env.FRONTEND_URL}`);
});


// Verificar si el correo ya está registrado
router.post('/check-email', async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo: email });
    if (usuario) {
      console.log(`El correo ${email} ya está registrado`);
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

  // Verificar si el usuario ya tiene un rubro personalizado llamado "Datos personales"
  const rubroPersonalizado = await RubroPersonalizado.findOne({
    usuarioId: usuario._id,
    nombre: 'Datos personales',
  });

  if (!rubroPersonalizado) {
    // IDs de los rubros default que se deben copiar
    const rubroDefaultIds = [
      "67eb8ab9101822e4446b1416",
    ];

    // Obtener los rubros default correspondientes
    const rubrosDefault = await RubroDefault.find({ _id: { $in: rubroDefaultIds } });

    // Crear copias de los rubros default en rubros personalizados
    const rubrosPersonalizados = rubrosDefault.map((rubro) => ({
      usuarioId: usuario._id,
      nombre: rubro.nombre,
      propiedades: rubro.propiedades,
      propiedadtipo: rubro.propiedadtipo,
      propiedadobligatorio: rubro.propiedadobligatorio,
    }));

    // Guardar los nuevos rubros personalizados
    await RubroPersonalizado.insertMany(rubrosPersonalizados);

    
  }

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

/* Ruta para enviar un correo de validacion */
router.post('/send_validation_link', async (req, res) => {
  const { correo, username, password} = req.body;
  if (!correo || !username || !password) {
    return res.status(400).json({ message: 'Faltan datos requeridos.' });
  }

  // 1) Comprueba que el correo no exista
  const exists = await Usuario.findOne({ correo });
  if (exists) {
    return res.status(409).json({ message: 'Este correo ya está en uso.' });
  }

  // 2) Hashea la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3) Prepara el payload completo
  const payload = {
    correo,
    username,
    hashedPassword,
  };

  // 4) Firma el token con 5 min de validez
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' });

  // 5) Construye el link
  const link = `${process.env.BACKEND_URL}/validate-email?token=${token}`;
  
  // 6) Envía el correo
  await transporter.sendMail({
    from: `"Shrimp Shelf" <${process.env.GMAIL_USER}>`,
    to: correo,
    subject: 'Valida tu correo electrónico (válido 5 min)',
    html: `
      <p>¡Bienvenido ${username}!</p>
      <p>Haz clic en este enlace para confirmar tu correo y completar el registro. Expira en 5 min:</p>
      <p><a href="${link}">Validar correo y registrarme.</a></p>
      <p>Si no solicitaste esto, ignora este mensaje.</p>
    `,
  });

  return res.json({ message: 'Correo de validación enviado. Revisa tu bandeja.' });
});


// Ruta para envier el correo de recuperacion hacia el debido usuario
router.post('/send_reset_link', async (req, res) => {
  const { correo } = req.body;
  try {
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
     
    // 3. Construye el enlace al formulario de reset
    const resetLink = `${process.env.BACKEND_URL}/verify-reset?token=${token}`;

    // 4. Envía el correo de recuperación
    await transporter.sendMail({
      from: `"Shrimp Shelf" <${process.env.GMAIL_USER}>`,
      to: usuario.correo,
      subject: 'Recupera tu contraseña (válido 5 min)',
      html: `
        <p>Hola ${usuario.username},</p>
        <p>Haz clic en el siguiente enlace para establecer tu nueva contraseña. El enlace expirará en 5 minutos:</p>
        <p><a href="${resetLink}">Recuperar contraseña.</a></p>
        <p>Si no solicitaste esto, revisa los dispositivos conectados a tu cuenta.</p>
      `,
    });

    return res.json({ message: 'Correo de recuperación enviado. Revisa tu bandeja.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno.' });
  }
});

// Verificar token de recuperación de contraseña y redirecciona al frontend indicado
router.get('/verify-reset', (req, res) => {
  const { token } = req.query;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.redirect(`${process.env.FRONTEND_URL1}?token=${token}`);
  } catch (err) {
    return res.status(401).json({ ok: false, message: 'Token inválido o expirado.' });
  }
});



// Resetear contraseña del usuario si y solo si el token sigue vigente
router.post('/reset-password', async (req, res) => {
  // 1) Primero intenta leer el token del body
  const token = req.body.token;
  const { newPassword } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token ausente.' });
  }
  if (!newPassword) {
    return res.status(400).json({ message: 'Nueva contraseña requerida.' });
  }

  try {
    // 2) Verifica el token igual que antes
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(payload.sub);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // 3) Hashea y guarda la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.contraseña = await bcrypt.hash(newPassword, salt);
    await usuario.save();

    return res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
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
