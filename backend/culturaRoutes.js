const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { criarCultura, getCulturas } = require('./culturaController');

// Pasta de upload (garantir que exista)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Rotas
router.post('/', upload.single('imagem'), criarCultura);
router.get('/', getCulturas);

module.exports = router;
