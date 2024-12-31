const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./config/db');
const passport = require('passport'); // Import correct
const configurePassport = require('./config/passport'); // Import de votre configuration personnalisée
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const { ensureVerified } = require('./auth');

// Configurer Socket.IO
io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté.');

  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté.');
  });
});

// Inclure Socket.IO dans les requêtes Express
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurer les sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 5 * 60 * 1000 }, // Expire après 5 minutes
  })
);

// Initialisation de Passport
configurePassport(passport); // Appliquer la configuration
app.use(passport.initialize());
app.use(passport.session());

// Configurer les dossiers publics
app.use(express.static(path.join(__dirname, 'public')));

// Routes avec protection
const { ensureAuthenticated } = require('./auth');
app.use('/api/users', require('./routes/users'));
app.use('/api/cocktails', ensureVerified, require('./routes/cocktails'));
app.use('/api/reactions', ensureVerified, require('./routes/reactions'));
app.get('/account.html', ensureVerified, (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', './public/account.html'));
});
// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Synchronisation de la base de données
sequelize
  .sync()
  .then(() => {
    console.log('Base de données synchronisée avec succès !');
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation de la base de données :', error);
  });

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
