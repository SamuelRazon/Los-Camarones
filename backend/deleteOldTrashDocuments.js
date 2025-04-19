const mongoose = require('mongoose');
const Document = require('./models/Document');
const { s3 } = require('./s3');
require('dotenv').config();

const deleteOldTrashDocuments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Conectado a la base de datos');

    // Calcular la fecha límite (30 dias)
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);

    // Buscar documentos en la papelera que hayan pasado el limite de 30 dias
    const documentos = await Document.find({
      fechadepapelera: { $lte: fechaLimite },
    });

    console.log(`Documentos a eliminar: ${documentos.length}`);

    for (const document of documentos) {
      // Eliminar el archivo de S3
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: document.urldocumento.split('/').pop(),
      };

      try {
        await s3.deleteObject(params).promise();
        console.log(`Archivo eliminado de S3: ${document.urldocumento}`);
      } catch (error) {
        console.error(`Error al eliminar archivo de S3: ${document.urldocumento}`, error);
      }

      // Eliminar el documento de la base de datos
      await Document.findByIdAndDelete(document._id);
      console.log(`Documento eliminado de la base de datos: ${document._id}`);
    }

    console.log('Eliminación de documentos antiguos completada');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error al eliminar documentos antiguos:', error);
    mongoose.connection.close();
  }
};

deleteOldTrashDocuments();