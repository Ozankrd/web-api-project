// Gestion de l'affichage plein écran des images
const images = document.querySelectorAll(".gallery-img");
const overlay = document.createElement("div");
overlay.classList.add("fullscreen-overlay");
overlay.innerHTML = `
  <span class="close-btn" aria-label="Fermer">&times;</span>
  <img src="" alt="Full Screen">
`;
document.body.appendChild(overlay);

const overlayImg = overlay.querySelector("img");
const closeBtn = overlay.querySelector(".close-btn");

images.forEach((img) => {
  img.addEventListener("click", () => {
    overlay.style.display = "flex";
    overlayImg.src = img.src;
  });
});

[overlay, closeBtn].forEach((el) => {
  el.addEventListener("click", (e) => {
    if (e.target === overlay || e.target === closeBtn) {
      overlay.style.display = "none";
    }
  });
});

// Fonction pour injecter dynamiquement un fichier HTML
async function injectHTML(selector, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur lors du chargement de ${url}`);
    document.querySelector(selector).innerHTML = await response.text();
  } catch (error) {
    console.error(error.message);
    document.querySelector(selector).innerHTML = `<p>Contenu temporairement indisponible.</p>`;
  }
}

// Injection dynamique du menu et du footer
injectHTML('#menu-container', 'menu.html');
injectHTML('#footer-container', 'footer.html').then(() => {
  // Gestion de l'état de connexion après le chargement du menu
  fetch('/api/users/status')
    .then((response) => response.json())
    .then((data) => {
      const authBtn = document.getElementById('auth-btn');
      const accountBtn = document.getElementById('account-btn');

      if (data.isAuthenticated) {
        authBtn.innerHTML = `
          <a href="#" id="logout-btn" class="logout" aria-label="Déconnexion">
            <span class="icon">👋</span> Déconnexion
          </a>
        `;
        accountBtn.style.display = 'block';

        document.getElementById('logout-btn').addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            const response = await fetch('/api/users/logout', { method: 'GET' });
            if (response.ok) {
              alert('Déconnexion réussie.');
              window.location.href = '/index.html';
            } else {
              throw new Error('Échec de la déconnexion.');
            }
          } catch (error) {
            console.error(error.message);
            alert(error.message);
          }
        });

        accountBtn.querySelector('a').addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            const response = await fetch('/api/users/send-code', { method: 'GET' });
            if (response.ok) {
              alert('Un code de vérification a été envoyé à votre email.');
              window.location.href = '/verify.html';
            } else {
              throw new Error('Erreur lors de l\'envoi du code.');
            }
          } catch (error) {
            console.error(error.message);
            alert(error.message);
          }
        });

      } else {
        authBtn.innerHTML = `
          <a href="/login.html" class="login" aria-label="Connexion">
            <span class="icon">👤</span> Connexion
          </a>
        `;
        accountBtn.style.display = 'none';
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la vérification de l\'état de connexion :', error);
    });
});
