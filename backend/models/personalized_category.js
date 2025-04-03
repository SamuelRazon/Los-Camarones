const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RubroPersonalizadoSchema = new Schema({
  usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }, // Referencia al usuario
  nombre: { type: String, required: true }, // Nombre del rubro personalizado
  fecha: { type: Date, required: true, default: Date.now }, // Fecha de creación
  propiedades: { type: [String], required: true } // Propiedades seleccionadas del rubro default
});

module.exports = mongoose.model('RubroPersonalizado', RubroPersonalizadoSchema);
