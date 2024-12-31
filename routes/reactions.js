const express = require('express');
const Reaction = require('../models/Reaction');
const { ensureAuthenticated } = require('../auth'); // Import correct
const router = express.Router();
const User = require('../models/User');

// Ajouter une réaction
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { cocktailId, type, comment } = req.body;

    // Créer la réaction
    const reaction = await Reaction.create({
      type,
      comment,
      userId: req.user.id,
      cocktailId,
    });

    // Inclure l'utilisateur dans la réponse
    const fullReaction = await Reaction.findByPk(reaction.id, {
      include: { model: User, attributes: ['username'] },
    });

    // Émettre un événement via Socket.IO
    req.io.emit('newReaction', fullReaction);

    res.status(201).json(fullReaction);
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ error: 'Failed to add reaction.' });
  }
});

// Récupérer toutes les réactions pour un cocktail
router.get('/:cocktailId', async (req, res) => {
  try {
    const { cocktailId } = req.params;

    // Trouver toutes les réactions associées au cocktail
    const reactions = await Reaction.findAll({
      where: { cocktailId },
      include: { model: User, attributes: ['username'] },
    });

    res.status(200).json(reactions);
  } catch (error) {
    console.error('Error fetching reactions:', error);
    res.status(500).json({ error: 'Failed to fetch reactions.' });
  }
});

module.exports = router;
