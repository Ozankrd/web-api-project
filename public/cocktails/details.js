// Initialiser Socket.IO
const socket = io(); // Assurez-vous que Socket.IO est chargé dans votre fichier HTML via <script src="/socket.io/socket.io.js"></script>

// Récupérer l'ID du cocktail depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const cocktailId = urlParams.get('id');

// Vérifier si l'ID est valide
if (!cocktailId) {
  alert('Aucun cocktail sélectionné.');
  window.location.href = 'cocktails.html'; // Redirection vers la liste si l'ID est manquant
}

// Fonction pour charger les détails du cocktail
async function loadCocktailDetails() {
  try {
    const response = await fetch(`/api/cocktails/${cocktailId}`);
    const cocktail = await response.json();

    if (!response.ok) {
      throw new Error(cocktail.error || 'Erreur lors du chargement du cocktail.');
    }

    // Remplir les informations dans la page
    document.getElementById('cocktail-name').textContent = cocktail.name;
    document.getElementById('cocktail-image').src = cocktail.image;
    document.getElementById('cocktail-description').textContent = cocktail.description;
    document.getElementById('cocktail-difficulty').textContent = `Difficulté : ${cocktail.difficulty || 'Non spécifiée'}`;
    document.getElementById('cocktail-preparation-time').textContent = `Temps de préparation : ${cocktail.preparationTime || 0} min`;
    document.getElementById('cocktail-cooking-time').textContent = `Nombre de personne : ${cocktail.cookingTime || 0} `;

    // Affiche le nom de l'utilisateur
    const username = cocktail.User?.username || 'Utilisateur inconnu';
    document.getElementById('cocktail-user').textContent = `Créé par : ${username}`;

    const ingredientsList = document.getElementById('cocktail-ingredients');
    ingredientsList.innerHTML = '';
    (cocktail.ingredients || '').split(',').forEach((ingredient) => {
      const li = document.createElement('li');
      li.textContent = ingredient.trim();
      ingredientsList.appendChild(li);
    });
  } catch (error) {
    console.error('Erreur :', error);
    alert('Erreur lors du chargement des détails du cocktail.');
  }
}

// Fonction pour charger les réactions
async function loadReactions(cocktailId) {
  try {
    const response = await fetch(`/api/reactions/${cocktailId}`);
    const reactions = await response.json();

    if (!response.ok) {
      throw new Error(reactions.error || 'Erreur lors du chargement des réactions.');
    }

    const reactionList = document.getElementById('cocktail-reactions');
    reactionList.innerHTML = '';
    reactions.forEach((reaction) => {
      const reactionDiv = document.createElement('div');
      reactionDiv.className = 'reaction-item';
      reactionDiv.innerHTML = `
        <p><strong>${reaction.User.username}</strong>: ${reaction.type === 'like' ? '👍' : reaction.comment}</p>
      `;
      reactionList.appendChild(reactionDiv);
    });
  } catch (error) {
    console.error('Erreur :', error);
  }
}

// Fonction pour publier une réaction
async function postReaction(cocktailId, type, comment = '') {
  try {
    const response = await fetch('/api/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cocktailId, type, comment }),
    });

    if (response.ok) {
      const reaction = await response.json();
      socket.emit('newReaction', reaction); // Émettre l'événement pour les nouvelles réactions
      loadReactions(cocktailId);
    } else {
      alert('Erreur lors de l\'ajout de la réaction.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la réaction :', error);
  }
}

// Charger les réactions après les détails du cocktail
loadCocktailDetails().then(() => {
  loadReactions(cocktailId);
});

// Ajoutez des gestionnaires d'événements pour les boutons de réaction
document.getElementById('like-button').addEventListener('click', () => postReaction(cocktailId, 'like'));
document.getElementById('comment-button').addEventListener('click', () => {
  const comment = prompt('Entrez votre commentaire :');
  if (comment) postReaction(cocktailId, 'comment', comment);
});

// Écouter les événements Socket.IO pour les nouvelles réactions
socket.on('newReaction', (data) => {
  if (data.cocktailId === parseInt(cocktailId, 10)) {
    const reactionList = document.getElementById('cocktail-reactions');
    const reactionDiv = document.createElement('div');
    reactionDiv.className = 'reaction-item';
    reactionDiv.innerHTML = `
      <p><strong>${data.User.username}</strong>: ${data.type === 'like' ? '👍' : data.comment}</p>
    `;
    reactionList.appendChild(reactionDiv);
  }
});

// Charger les détails au chargement de la page
loadCocktailDetails();
