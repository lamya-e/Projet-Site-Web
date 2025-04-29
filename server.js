const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
mongoose.connect('TON_LIEN_MONGODB')
  .then(() => console.log('MongoDB connecté !'))
  .catch((err) => console.error(err));
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  



  