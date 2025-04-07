const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RubroPersonalizadoSchema = new Schema({
  usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }, // Referencia al usuario
  nombre: { type: String, required: true }, // Nombre del rubro personalizado
  propiedades: { type: [String], required: true }, // Propiedades seleccionadas del rubro default
  propiedadtipo: { 
    type: [String], 
    required: true, 
    enum: ['string', 'number', 'date', 'boolean'] // Tipos de datos permitidos
  },
  propiedadobligatorio: { type: [Boolean], required: true } // Booleano que indica si la propiedad es obligatoria o no
}, {collection: 'rubrosPersonalizados'});

module.exports = mongoose.model('RubroPersonalizado', RubroPersonalizadoSchema);
