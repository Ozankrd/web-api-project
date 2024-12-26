// Fonction pour charger tous les cocktails
async function loadCocktails() {
  try {
    const response = await fetch('/api/cocktails');
    if (!response.ok) throw new Error('Erreur lors de la récupération des cocktails');
    const cocktails = await response.json();

    const cocktailList = document.getElementById('cocktail-list');
    if (!cocktailList) {
      console.error("Élément #cocktail-list introuvable dans l'HTML.");
      return;
    }
    cocktailList.innerHTML = '';

    cocktails.forEach((cocktail) => {
      const username = cocktail.User?.username || 'Utilisateur inconnu';
      const cocktailDiv = document.createElement('div');
      cocktailDiv.className = 'cocktail-item';
      cocktailDiv.setAttribute('data-id', cocktail.id);
      cocktailDiv.innerHTML = `
        <img src="${cocktail.image}" alt="${cocktail.name}" style="width:100px;height:100px;">
        <h3>${cocktail.name}</h3>
        <p>${cocktail.description}</p>
        <p>Créé par : ${username}</p>
        <button onclick="viewCocktail(${cocktail.id})">Voir plus</button>
        <button onclick="deleteCocktail(${cocktail.id})">Supprimer</button>
      `;
      cocktailList.appendChild(cocktailDiv);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des cocktails :', error.message);
    alert('Erreur lors du chargement des cocktails. Veuillez réessayer plus tard.');
  }
}


// Fonction pour afficher les détails d'un cocktail
function viewCocktail(id) {
  if (!id) {
    console.error('ID de cocktail manquant.');
    return;
  }
  window.location.href = `/cocktails/details.html?id=${id}`;
}

// Fonction pour vérifier si l'utilisateur est connecté
async function checkLoginStatus() {
  try {
    const response = await fetch('/api/users/status'); // Vérification de connexion
    if (!response.ok) throw new Error('Erreur de connexion au serveur');
    return await response.json(); // Retourner l'état de l'utilisateur
  } catch (error) {
    console.error('Erreur de vérification de connexion :', error.message);
    return null; // Retourner null en cas d'erreur
  }
}

// Fonction pour afficher ou cacher le formulaire en fonction de l'état de connexion
async function toggleFormVisibility() {
  try {
    const user = await checkLoginStatus(); // Vérification de l'utilisateur
    const form = document.getElementById('cocktail-form');
    const loginMessage = document.getElementById('login-message');

    if (!form) {
      console.error("Élément #cocktail-form introuvable dans l'HTML.");
      return;
    }
    if (!loginMessage) {
      console.error("Élément #login-message introuvable dans l'HTML.");
      return;
    }

    if (user) {
      form.style.display = 'block'; // Affiche le formulaire si connecté
      loginMessage.style.display = 'none'; // Cache le message si connecté
    } else {
      form.style.display = 'none'; // Cache le formulaire si non connecté
      loginMessage.style.display = 'block'; // Affiche le message pour les non-connectés
    }
  } catch (error) {
    console.error('Erreur lors de la gestion de la visibilité du formulaire :', error.message);
  }
}

// Fonction pour gérer l'envoi du formulaire
document.getElementById('cocktail-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('ingredients', document.getElementById('ingredients').value);
  formData.append('difficulty', document.getElementById('difficulty').value);
  formData.append('preparationTime', document.getElementById('preparationTime').value);
  formData.append('cookingTime', document.getElementById('cookingTime').value);
  formData.append('image', document.getElementById('image').files[0]);

  try {
    const response = await fetch('/api/cocktails/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Cocktail posté avec succès !');
      document.getElementById('cocktail-form').reset();
      loadCocktails(); // Recharger la liste des cocktails
    } else {
      const errorData = await response.json();
      alert(errorData.error || 'Erreur lors de l\'envoi du cocktail.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du cocktail :', error.message);
    alert('Une erreur inattendue est survenue.');
  }
});
// Fonction pour supprimer un cocktail
// Fonction pour supprimer un cocktail
function deleteCocktail(cocktailId) {
  if (!confirm('Voulez-vous vraiment supprimer ce cocktail ?')) return;

  fetch(`/api/cocktails/${cocktailId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || 'Erreur inconnue');
        });
      }
      alert('Cocktail supprimé avec succès.');
      location.reload(); // Réactualiser la page après suppression
    })
    .catch((error) => {
      console.error('Erreur lors de la suppression du cocktail :', error);
      alert(error.message);
    });
}

// Charger les cocktails au chargement de la page
loadCocktails();
toggleFormVisibility();
