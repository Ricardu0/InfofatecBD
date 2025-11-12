const mongoose = require('mongoose');

const CulturaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  imagem: { type: String } // Caminho do arquivo salvo
}, {
  timestamps: true
});

module.exports = mongoose.model('Cultura', CulturaSchema);
