const express = require('express');
const jwt = require('jsonwebtoken');
const Platform = require('.../models/Platform');

const router = express.Router();

// Middleware pour vérifier le token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token manquant');

  jwt.verify(token, 'SECRET', (err, decoded) => {
    if (err) return res.status(401).send('Token invalide');
    req.userId = decoded.userId;
    next();
  });
}

// Ajouter une plateforme
router.post('/', verifyToken, async (req, res) => {
  const { name, url, allowedDuration, allowedDays } = req.body;

  const platform = new Platform({
    userId: req.userId,
    name,
    url,
    allowedDuration,
    allowedDays,
  });

  await platform.save();
  res.status(201).send('Plateforme ajoutée');
});

// Voir toutes ses plateformes
router.get('/', verifyToken, async (req, res) => {
  const platforms = await Platform.find({ userId: req.userId });
  res.json(platforms);
});

// Modifier une plateforme
router.put('/:id', verifyToken, async (req, res) => {
  const platformId = req.params.id;
  await Platform.findOneAndUpdate({ _id: platformId, userId: req.userId }, req.body);
  res.send('Plateforme mise à jour');
});

// Supprimer une plateforme
router.delete('/:id', verifyToken, async (req, res) => {
  const platformId = req.params.id;
  await Platform.findOneAndDelete({ _id: platformId, userId: req.userId });
  res.send('Plateforme supprimée');
});

module.exports = router;
