if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js')
    .then(function(registration) {
      console.log('Service Worker registrado con éxito:', registration);
      console.log('El registro del ServiceWorker fue exitoso, tiene el siguiente alcance: ', registration.scope)
    })
    .catch(function(error) {
      console.error('Error al registrar el Service Worker:', error);
    });

    
    //Solicitar permisos de notification
    if ('Notification' in window && navigator.serviceWorker) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permiso de notificación concedido');
            } else {
                console.log('Permiso de notificación denegado');
            }
        });
    }
}
const characterCardsContainer = document.querySelector('.character-cards');
const modal = document.getElementById('modal');
const API = 'https://pokeapi.co/api/v2/pokemon';


async function getPokemon() {
    try {

        //Prueba para visualizar funcionamiento de async/await
        //var esperarHasta = new Date().getTime() + 20000;
        //while(new Date().getTime() < esperarHasta) continue;
        
        const response = await fetch(`${API}?limit=20`);
        const data = await response.json();
        const pokemonList = data.results;
        const pokemonData = await Promise.all(pokemonList.map(pokemon => fetchPokemonData(pokemon)));
        generateCharacterCards(pokemonData);
        console.log(data)
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
    }
}

async function fetchPokemonData(pokemon) {
    const response = await fetch(pokemon.url);
    return await response.json();
}

function generateCharacterCards(pokemonData) {
    characterCardsContainer.innerHTML = '';

    pokemonData.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('character-card');
        card.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <button data-id="${pokemon.id}">Ver detalles</button>
        `;

        card.querySelector('button').addEventListener('click', () => {
            showCharacterDetails(pokemon);
        });

        characterCardsContainer.appendChild(card);
    });
}

const favoritos = [];

function showCharacterDetails(pokemon) {
    modal.innerHTML = '';

    modal.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <h3>Abilities:</h3>
        <ul>
            ${pokemon.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
        <div class="modal-buttons">
            <button class="close-button">Cerrar</button>
            <button class="add-to-favorites-button">Agregar a favoritos</button>
        </div>
    `;

    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    const addToFavoritesButton = modal.querySelector('.add-to-favorites-button');
    addToFavoritesButton.addEventListener('click', () => {
        if (!favoritos.includes(pokemon)) {
            favoritos.push(pokemon);
            // Aquí puedes realizar acciones adicionales, como actualizar la interfaz de usuario
            console.log('Pokémon agregado a favoritos:', pokemon);
        }
    });

    modal.classList.add('open');
}

window.addEventListener('DOMContentLoaded', () => {
    getPokemon();
});

// Función para mostrar Pokémon favoritos en la pantalla
function displayFavorites() {
  characterCardsContainer.innerHTML = '';
  
  favoritos.forEach(pokemon => {
      const card = document.createElement('div');
      card.classList.add('character-card');
      card.innerHTML = `
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
          <h2>${pokemon.name}</h2>
          <button data-id="${pokemon.id}">Ver detalles</button>
          <button data-id="${pokemon.id}" class="remove-from-favorites-button">Eliminar de favoritos</button>
      `;
      card.querySelector('button.remove-from-favorites-button').addEventListener('click', () => {
          removeFromFavorites(pokemon);
      });
      characterCardsContainer.appendChild(card);
  });

  // Agregar un botón para volver al listado principal
  const backToListButton = document.getElementById('back-to-list-button');
  backToListButton.style.display = 'block';
}

// Función para eliminar un Pokémon de la lista de favoritos
function removeFromFavorites(pokemon) {
  const index = favoritos.indexOf(pokemon);
  if (index !== -1) {
      favoritos.splice(index, 1);
      // Puedes realizar acciones adicionales, como actualizar la interfaz de usuario
      displayFavorites();
  }
}

// Evento para mostrar los Pokémon favoritos al hacer clic en "Favoritos"
const favoritosLink = document.getElementById('favoritos-link');
favoritosLink.addEventListener('click', () => {
  displayFavorites();
});

// Evento para volver al listado principal
const backToListButton = document.getElementById('back-to-list-button');
backToListButton.addEventListener('click', () => {
  characterCardsContainer.innerHTML = '';
  backToListButton.style.display = 'none';
  getPokemon(); // Volver al listado principal
});

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

searchButton.addEventListener('click', async () => {
    const pokemonName = searchInput.value.trim().toLowerCase();
    if (pokemonName) {
        try {
            const response = await fetch(`${API}/${pokemonName}`);
            if (response.ok) {
                const pokemon = await response.json();
                showCharacterDetails(pokemon);
                searchInput.value = ''; // Limpia el campo de búsqueda
            } else {
                // Si la respuesta no es exitosa, muestra un mensaje de error
                const errorMessage = document.getElementById('error-message');
                errorMessage.textContent = 'El Pokémon ingresado no existe en la base de datos.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al buscar el Pokémon:', error);
        }
    }
});