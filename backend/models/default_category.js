const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RubroDefaultSchema = new Schema({
  nombre: { type: String, required: true }, // Nombre del rubro default
  propiedades: { type: [String], required: true }, // Lista de propiedades obligatorias
  propiedadtipo: { 
    type: [String],
    required: true,
    enum: ['string', 'number', 'date', 'boolean', 'enum'] // Tipos de datos permitidos para cada propiedad
  },
  propiedadobligatorio: { type: [Boolean], required: true } // Booleano que indica si la propiedad es obligatoria o no
}, { collection: 'rubrosDefault' });

module.exports = mongoose.model('RubroDefault', RubroDefaultSchema);
