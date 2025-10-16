import { setupFooterAndHeader } from "./modules.js";
setupFooterAndHeader();

const container = document.getElementById('watchlist-movies');

function renderWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    container.innerHTML = '';

    if (!watchlist.length) {
        container.innerHTML = '<p>Your watchlist is empty.</p>';
        return;
    }

    watchlist.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="poster-img"><img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"></div>
            <div class="info">
                <h2>${movie.title}</h2>
                <div class="single-info">
                    <span>Rating: ${movie.vote_average}</span>
                    <span class="remove-icon" data-id="${movie.id}">❌</span>
                </div>
            </div>
        `;
        card.querySelector('.remove-icon').addEventListener('click', () => {
            removeFromWatchlist(movie.id);
        });
        container.appendChild(card);
    });
}

function removeFromWatchlist(id) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(movie => movie.id !== id);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    renderWatchlist();
}

// Initialize
renderWatchlist();