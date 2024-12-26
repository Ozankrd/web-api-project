const Cocktail = require('../models/Cocktail');

// Récupérer tous les cocktails
exports.getAllCocktails = async (req, res) => {
  try {
    const cocktails = await Cocktail.findAll();
    res.status(200).json(cocktails);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching cocktails.' });
  }
};

// Récupérer un cocktail par ID
exports.getCocktailById = async (req, res) => {
  try {
    const { id } = req.params;
    const cocktail = await Cocktail.findByPk(id);
    if (!cocktail) {
      return res.status(404).json({ error: 'Cocktail not found.' });
    }
    res.status(200).json(cocktail);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching the cocktail.' });
  }
};

// Ajouter un nouveau cocktail
exports.createCocktail = async (req, res) => {
  try {
    const { name, description, ingredients } = req.body;
    const newCocktail = await Cocktail.create({ name, description, ingredients });
    res.status(201).json(newCocktail);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while creating the cocktail.' });
  }
};

// Mettre à jour un cocktail
exports.updateCocktail = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, ingredients } = req.body;
    const cocktail = await Cocktail.findByPk(id);
    if (!cocktail) {
      return res.status(404).json({ error: 'Cocktail not found.' });
    }
    cocktail.name = name || cocktail.name;
    cocktail.description = description || cocktail.description;
    cocktail.ingredients = ingredients || cocktail.ingredients;
    await cocktail.save();
    res.status(200).json(cocktail);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while updating the cocktail.' });
  }
};

// Supprimer un cocktail
exports.deleteCocktail = async (req, res) => {
  try {
    const { id } = req.params;
    const cocktail = await Cocktail.findByPk(id);
    if (!cocktail) {
      return res.status(404).json({ error: 'Cocktail not found.' });
    }
    await cocktail.destroy();
    res.status(204).send(); // Pas de contenu
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while deleting the cocktail.' });
  }
};
