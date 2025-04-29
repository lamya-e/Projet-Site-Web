const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('.../models/User');
const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).send('Utilisateur créé');
  } catch (err) {
    res.status(400).send('Erreur lors de la création');
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Email incorrect');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).send('Mot de passe incorrect');

  const token = jwt.sign({ userId: user._id }, 'SECRET', { expiresIn: '1d' });
  
  res.json({ token });
});

module.exports = router;
