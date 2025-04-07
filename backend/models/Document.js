const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new mongoose.Schema({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  rubro: { type: Schema.Types.ObjectId, required: true }, //Esta es la object id del rubro del documento
  rubroModel: { //Esto le indica a mongo de donde pertenece el object id, porque este no lo sabe 
    type: String,
    enum: ['rubrosDefault', 'rubrosPersonalizados'],
    required: true
  },
  propiedadesnombre: { type: [String], required: true }, //Todos los array de propiedades deben de tener la misma cantidad de indices
  propiedades: { type: [String], required: true },
  fechadealta: { type: Date, default: Date.now },
  urldocumento: { type: String, required: true },
  adjunto: { type: Boolean, default: false }
});

module.exports = mongoose.model('Documentos', DocumentSchema);
