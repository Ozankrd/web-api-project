const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const router = express.Router();

// Configuration du transport SMTP avec vos informations Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});


// Stockage temporaire des codes de vérification
const verificationCodes = {};

// Ajout dans login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ error: 'Authentication failed' });
    if (!user) return res.status(401).json({ error: info.message });

    req.login(user, async (loginErr) => {
      if (loginErr) return res.status(500).json({ error: 'Login failed' });

      // Générer un code de vérification 2FA
      const code = Math.floor(1000 + Math.random() * 9000);
      verificationCodes[user.id] = code;

      try {
        // Envoyer le code à l'utilisateur via Mailtrap
        await transporter.sendMail({
          from: '"Cook Tail" <no-reply@cooktail.com>',
          to: user.email,
          subject: 'Code de vérification 2FA',
          text: `Votre code de vérification est : ${code}`,
        });

        res.status(200).json({
          message: 'Login successful. Code de vérification envoyé.',
          redirect: '/verify.html',
        });
      } catch (mailErr) {
        console.error('Erreur lors de l\'envoi du code :', mailErr);
        res.status(500).json({ error: 'Login réussi, mais échec de l\'envoi du code.' });
      }
    });
  })(req, res, next);
});

// Vérifier le code 2FA
router.post('/verify', (req, res) => {
  const { code } = req.body;

  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Non autorisé.' });
  }

  if (parseInt(code, 10) === verificationCodes[req.user.id]) {
    delete verificationCodes[req.user.id];
    req.session.isVerified = true; // Marque la session comme vérifiée
    return res.status(200).json({ message: 'Vérification réussie.' });
  }

  res.status(400).json({ error: 'Code incorrect.' });
});




// Vérifier l'état de connexion de l'utilisateur
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ isAuthenticated: true });
  }
  return res.status(200).json({ isAuthenticated: false });
});

// Route pour envoyer le code
router.get('/send-code', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Non autorisé.' });
  }

  const code = Math.floor(1000 + Math.random() * 9000);

  verificationCodes[req.user.id] = code;

  try {
    await transporter.sendMail({
      from: '"Cook Tail" <no-reply@cooktail.com>',
      to: req.user.email,
      subject: 'Votre code de vérification',
      text: `Votre code de vérification est : ${code}`,
    });

    res.status(200).json({ message: 'Code envoyé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du code.' });
  }
});

// Route pour mettre à jour l'email ou le mot de passe
router.put('/update', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Non autorisé.' });
  }

  const { email, password, confirmPassword } = req.body;
  const updates = {};

  if (email) updates.email = email;

  if (password || confirmPassword) {
    if (!password) {
      return res.status(400).json({ error: 'Le mot de passe est requis pour la mise à jour.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Les mots de passe ne correspondent pas.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
      });
    }

    updates.password = await bcrypt.hash(password, 10);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Aucune donnée à mettre à jour.' });
  }

  try {
    await User.update(updates, { where: { id: req.user.id } });
    res.status(200).json({ message: 'Mise à jour réussie.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// Logout user
router.get('/logout', (req, res) => {
  const username = req.user?.username || 'Unknown User';

  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }

    req.io.emit('userLoggedOut', { username });

    res.status(200).json({ message: 'Logout successful' });
  });
});

module.exports = router;
