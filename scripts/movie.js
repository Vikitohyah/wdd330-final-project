import { setupFooterAndHeader } from "./modules.js";
setupFooterAndHeader();

const API_KEY = 'ddf69887bef48b884e9d1c8c4b9556e8';
const BASE_URL = 'https://api.themoviedb.org/3';

const trendingMoviesContainer = document.getElementById('trending-movies');
const categoryMoviesContainer = document.getElementById('category-movies');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const heroSection = document.getElementById('hero');
const heroTitle = document.getElementById('hero-title');
const heroOverview = document.getElementById('hero-overview');


// ---------------- API Calls ----------------

async function loadHeroMovie() {
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const data = await res.json();

        const movie = data.results[Math.floor(Math.random() * data.results.length)];

        heroSection.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
        heroTitle.textContent = movie.title;
        heroOverview.textContent = movie.overview;

        document.getElementById('watch-now').addEventListener('click', () => {
            window.location.href = `movie.html?id=${movie.id}`;
        });

    } catch (error) {
        console.error('Error loading hero movie:', error);
    }
}

async function fetchTrendingMovies() {
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await res.json();
        renderMovies(data.results, trendingMoviesContainer);
    } catch {
        showError('Failed to fetch trending movies.');
    }
}

// ---------------- Rendering ----------------
function renderMovies(movies, container) {
    container.innerHTML = '';
    if (!movies.length) {
        container.innerHTML = '<p>No movies found.</p>';
        return;
    }
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="poster-img"><img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" loading="lazy"></div>
            <div class="info">
                <h2>${movie.title}</h2>
                <div class="single-info">
                    <span>Rating: ${movie.vote_average}</span>
                    <span class="heart-icon" data-id="${movie.id}">❤️</span>
                </div>
            </div>
        `;
        card.querySelector('.heart-icon').addEventListener('click', e => {
            e.stopPropagation();
            addToWatchlist(movie);
        });
        card.addEventListener('click', () => showMovieDetails(movie.id));
        container.appendChild(card);
    });
}

// Init
loadHeroMovie();
fetchTrendingMovies();

