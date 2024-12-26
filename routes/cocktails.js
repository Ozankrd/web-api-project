const express = require('express');
const multer = require('multer');
const path = require('path');
const Cocktail = require('../models/Cocktail');
const User = require('../models/User'); // Assurez-vous que le modèle User est bien importé
const auth = require('../middlewares/auth'); // Importez le middleware d'authentification

const router = express.Router();

// Configuration multer (comme dans votre code actuel)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/cocktails/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Protégez la route de création de cocktails
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  console.log('Middleware auth exécuté pour upload. Utilisateur :', req.user);
  try {
    const { name, description, ingredients, difficulty, preparationTime, cookingTime } = req.body;
    const imageUrl = `/cocktails/uploads/${req.file.filename}`;
    const cocktail = await Cocktail.create({
      name,
      description,
      ingredients,
      image: imageUrl,
      difficulty,
      preparationTime,
      cookingTime,
      userId: req.user.id,
    });

    // Notifier tous les clients connectés d'un nouveau cocktail
    req.io.emit('newCocktail', cocktail);

    res.status(201).json(cocktail);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image.' });
  }
});

// Supposons qu'il existe une route pour supprimer un cocktail
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const cocktail = await Cocktail.findByPk(id);

    if (!cocktail) {
      return res.status(404).json({ error: 'Cocktail not found.' });
    }

    await cocktail.destroy();

    // Notifier tous les clients connectés de la suppression
    req.io.emit('deleteCocktail', id);

    res.status(200).json({ message: 'Cocktail deleted successfully.' });
  } catch (error) {
    console.error('Error deleting cocktail:', error);
    res.status(500).json({ error: 'Failed to delete cocktail.' });
  }
});


// Route pour récupérer tous les cocktails avec les informations des utilisateurs
router.get('/', async (req, res) => {
  try {
    const cocktails = await Cocktail.findAll({
      include: {
        model: User,
        attributes: ['username'], // Ajoutez les champs nécessaires
      },
    });
    res.status(200).json(cocktails);
  } catch (error) {
    console.error('Error fetching cocktails:', error);
    res.status(500).json({ error: 'Failed to fetch cocktails.' });
  }
});

// Route pour récupérer un cocktail par ID avec son utilisateur
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cocktail = await Cocktail.findByPk(id, {
      include: { model: User, attributes: ['username'] }, // Inclut uniquement le username
    });

    if (!cocktail) {
      return res.status(404).json({ error: 'Cocktail not found.' });
    }

    // Notifier les clients connectés via Socket.IO qu'un cocktail a été consulté
    req.io.emit('cocktailViewed', {
      message: `${cocktail.name} a été consulté.`,
      cocktailId: id,
    });

    res.status(200).json(cocktail);
  } catch (error) {
    console.error('Error fetching cocktail by ID:', error);
    res.status(500).json({ error: 'Failed to fetch cocktail.' });
  }
});
// Route pour supprimer un cocktail
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const cocktail = await Cocktail.findByPk(id);

    if (!cocktail) {
      return res.status(404).json({ error: 'Cocktail non trouvé.' });
    }

    // Vérifiez si l'utilisateur est le créateur du cocktail
    if (cocktail.userId !== req.user.id) {
      return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer ce cocktail.' });
    }

    await cocktail.destroy();

    // Émettre un événement Socket.IO pour mettre à jour la liste côté client
    req.io.emit('deleteCocktail', id);

    res.status(200).json({ message: 'Cocktail supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du cocktail :', error);
    res.status(500).json({ error: 'Échec de la suppression du cocktail.' });
  }
});


// Route de déconnexion (inutile ici pour les cocktails mais gardée par sécurité)
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Erreur lors de la déconnexion:', err);
      return res.status(500).json({ error: 'Erreur lors de la déconnexion.' });
    }
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Erreur lors de la destruction de la session:', destroyErr);
        return res.status(500).json({ error: 'Erreur lors de la destruction de la session.' });
      }
      console.log('Session détruite avec succès.');
      res.status(200).json({ message: 'Déconnecté avec succès.' });
    });
  });
});

module.exports = router;
