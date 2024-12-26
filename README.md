# Gestion de Cocktails avec Double Authentification

## Introduction
Ce projet vise à offrir une plateforme web de gestion de cocktails, permettant aux utilisateurs de publier, consulter et interagir avec des recettes tout en garantissant une sécurité renforcée grâce à la double authentification.

---

## Table des Matières
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Contributions](#contributions)
- [Licence](#licence)

---

## Fonctionnalités

### Gestion des Utilisateurs
- **Inscription** : Création de compte avec validation des champs.
- **Connexion** : Sécurisée via Passport.js et double authentification par code temporaire.
- **Mise à jour** : Modification des informations personnelles (email, mot de passe).
- **Déconnexion** : Gestion sécurisée des sessions.

### Gestion des Cocktails
- **Ajout de Recettes** : Téléversement d'images et gestion des métadonnées.
- **Suppression** : Accès restreint aux propriétaires des recettes.
- **Consultation** : Affichage de la liste et des détails des cocktails.

### Interactions en Temps Réel
- **Notifications** : Mise à jour en direct des ajouts et suppressions de cocktails via Socket.IO.

---

## Prérequis

Avant de continuer, assurez-vous d'avoir :

- Node.js installé (version 14 ou supérieure).
- PostgreSQL configuré et en cours d'exécution.
- Un compte Mailtrap pour le test des emails.
- Une connaissance de base en JavaScript et gestion des API REST.

---

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone <URL_DU_DEPOT>
   ```
2. Accédez au répertoire du projet :
   ```bash
   cd gestion-cocktails
   ```
3. Installez les dépendances :
   ```bash
   npm install
   ```
4. Configurez les variables d'environnement dans un fichier `.env` :
   ```
   DB_HOST=<hôte_de_la_base_de_données>
   DB_USER=<utilisateur>
   DB_PASSWORD=<mot_de_passe>
   MAILTRAP_USER=<utilisateur_mailtrap>
   MAILTRAP_PASSWORD=<mot_de_passe_mailtrap>
   ```
5. Synchronisez la base de données :
   ```bash
   npx sequelize db:migrate
   ```
6. Lancez le serveur :
   ```bash
   npm start
   ```

---

## Utilisation

### Accéder à l'interface
- Ouvrez un navigateur et accédez à `http://localhost:3000`.

### Fonctionnalités Principales
1. **Créer un compte** : Remplissez le formulaire d'inscription.
2. **Se connecter** : Entrez vos identifiants et validez le code temporaire reçu par email.
3. **Ajouter un cocktail** : Soumettez une recette et téléchargez une image.
4. **Interagir** : Aimez ou commentez les recettes disponibles.

---

## Contributions

Nous accueillons volontiers les contributions pour améliorer ce projet. Suivez ces étapes :

1. Forkez le dépôt.
2. Créez une branche pour votre fonctionnalité ou correctif :
   ```bash
   git checkout -b ma-feature
   ```
3. Effectuez vos modifications.
4. Soumettez une pull request.

---

## Licence

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](LICENSE) pour plus d'informations.
