module.exports = (req, res, next) => {
    console.log('Authenticated:', req.isAuthenticated()); // Ajoutez ce log
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Non autorisé. Veuillez vous connecter.' });
  };
  