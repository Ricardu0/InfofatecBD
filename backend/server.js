const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const culturaRoutes = require('./culturaRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // ok, precisa vir antes das rotas
app.use('/uploads', express.static('uploads')); // servir imagens

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB Atlas'))
  .catch(err => console.log('❌ Erro ao conectar ao banco:', err));

app.use('/api/culturas', culturaRoutes);

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
