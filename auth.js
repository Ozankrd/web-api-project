function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Non autorisé.' });
}

function ensureVerified(req, res, next) {
  if (req.isAuthenticated() && req.session.isVerified) {
    return next();
  }
  req.logout((err) => {
    if (err) {
      console.error('Erreur lors de la déconnexion :', err);
    }
    res.status(401).json({ error: 'Vous devez valider votre code pour accéder à cette section.' });
  });
}

module.exports = { ensureAuthenticated, ensureVerified };
