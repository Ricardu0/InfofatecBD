const Cultura = require('./Cultura');

// Criar post
exports.criarCultura = async (req, res) => {
  try {
    // Captura dos campos de texto e arquivo
    const { titulo, descricao } = req.body || {};
    const imagem = req.file ? req.file.filename : null;

    if (!titulo || !descricao) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const novaCultura = new Cultura({
      titulo,
      descricao,
      imagem
    });

    await novaCultura.save();
    res.status(201).json(novaCultura);
  } catch (error) {
    console.error('❌ Erro ao criar cultura:', error);
    res.status(500).json({ error: error.message });
  }
};
// Listar todos
exports.getCulturas = async (req, res) => {
  try {
    const culturas = await Cultura.find().sort({ createdAt: -1 });
    res.json({ success: true, data: culturas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Atualizar
exports.updateCultura = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao } = req.body;
    const imagem = req.file ? req.file.path : undefined;

    const cultura = await Cultura.findByIdAndUpdate(
      id,
      { titulo, descricao, ...(imagem && { imagem }) },
      { new: true }
    );

    res.json({ success: true, data: cultura });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Deletar
exports.deleteCultura = async (req, res) => {
  try {
    await Cultura.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
