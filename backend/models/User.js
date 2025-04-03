const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
  correo: { type: String, required: true, unique: true }, // Correo obligatorio y único
  contraseña: { type: String, required: true }, // Contraseña obligatoria
  username: { type: String, required: true }, // URL o path de la foto
  foto: { type: String}, // URL o path de la foto

  // Referencias a rubrosDefault y rubrosPersonalizados
  rubrosDefault: [{ type: Schema.Types.ObjectId, ref: 'RubroDefault' }], // Rubros default referenciados
  rubrosPersonalizados: [{ type: Schema.Types.ObjectId, ref: 'RubroPersonalizado' }] // Rubros personalizados
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
