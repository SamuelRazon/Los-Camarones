const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new mongoose.Schema({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  rubro: {type: Schema.Types.ObjectId, refPath: 'rubroModel', required: true },
  rubroModel: {
    type: String,
    enum: ['rubrosDefault', 'rubrosPersonalizados'],
    required: true
  },
  propiedadesnombre: { type: [String], required: true }, //Todos los array de propiedades deben de tener la misma cantidad de indices
  propiedades: { type: [Schema.Types.Mixed], required: true },
  adjunto: { type: Boolean, default: false },
  urldocumento: { type: String },
 
});

module.exports = mongoose.model('Documentos', DocumentSchema);
