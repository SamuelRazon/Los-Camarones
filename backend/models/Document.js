// De quien es la coso subida
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  rubro: { type: String, required: true },
  s3Url: { type: String, required: true },
  fileName: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);
