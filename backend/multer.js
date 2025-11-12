const multer = require('multer');
const path = require('path');

// configuração do destino e nome do arquivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // pasta onde salvar as imagens
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nome único
  }
});

const upload = multer({ storage });
