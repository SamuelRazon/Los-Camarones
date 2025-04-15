const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/User')
const RubroPersonalizado = require('../models/personalized_category')
const { authMiddleware } = require('../middleware/auth')
const router = express.Router()


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


/* aun sin funcionar
router.put('/trash/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Se marca como eliminado
    const document = await Document.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    res.json({ message: 'Documento movido a la papelera', document });
  } catch (error) {
    console.error('Error al mover el documento a la papelera:', error);
    res.status(500).json({ error: 'Error al mover el documento a la papelera' });
  }
});
*/

// Endpoint para borrar archivos
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Busca el documento en la base de datos
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    // Configurar los parametros para eliminar el archivo de S3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: document.urldocumento.split('/').pop(), // Extraer el nombre url
    };

    // Eliminar el documento de S3
    await s3.deleteObject(params).promise();

    // Eliminar el documento de la base de datos
    await Document.findByIdAndDelete(id);

    res.json({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
    res.status(500).json({ error: 'Error al eliminar el archivo' });
  }
});


module.exports = router
