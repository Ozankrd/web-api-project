function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Non autorisé.' });
  }
  
  module.exports = { ensureAuthenticated };
  