import { setupFooterAndHeader } from "./modules.js";
setupFooterAndHeader();

const API_KEY = 'ddf69887bef48b884e9d1c8c4b9556e8';
const BASE_URL = 'https://api.themoviedb.org/3';

const trendingMoviesContainer = document.getElementById('trending-movies');
const categoryMoviesContainer = document.getElementById('category-movies');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const heroSection = document.getElementById('hero');
const heroTitle = document.getElementById('hero-title');
const heroOverview = document.getElementById('hero-overview');

// ---------------- Utility Functions ----------------
function showLoadingSpinner() {
    loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
    loadingSpinner.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// ---------------- API Calls ----------------

async function loadHeroMovie() {
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const data = await res.json();

        const movie = data.results[Math.floor(Math.random() * data.results.length)];

        heroSection.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
        heroTitle.textContent = movie.title;
        heroOverview.textContent = movie.overview;

        document.querySelector('.watch-now').addEventListener('click', () => {
            window.location.href = `pages/watchnow.html?id=${movie.id}`;
        });

    } catch (error) {
        console.error('Error loading hero movie:', error);
    }
}

async function fetchTrendingMovies() {
    showLoadingSpinner();
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await res.json();
        renderMovies(data.results, trendingMoviesContainer);
    } catch {
        showError('Failed to fetch trending movies.');
    } finally {
        hideLoadingSpinner();
    }
}

async function fetchMoviesByCategory(genre) {
    showLoadingSpinner();
    try {
        const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre}&language=en-US`);
        const data = await res.json();
        renderMovies(data.results, categoryMoviesContainer);
    } catch {
        showError('Failed to fetch category movies.');
    } finally {
        hideLoadingSpinner();
    }
}

async function searchMovies(query) {
    showLoadingSpinner();
    try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await res.json();
        renderMovies(data.results, trendingMoviesContainer);
    } catch {
        showError('Failed to search movies.');
    } finally {
        hideLoadingSpinner();
    }
}

async function showMovieDetails(movieId) {
    showLoadingSpinner();
    try {
        const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
        const movie = await res.json();
        hideLoadingSpinner();

        const movieDetails = document.getElementById("movieDetails");
        movieDetails.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <h2>${movie.title}</h2>
                    <button id="closePopup">X</button>
                </div>
                <div class="popup-body">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster" class="movie-poster" loading="lazy">
                    <div class="movie-info">
                        <p><strong>Rating:</strong> ${movie.vote_average} / 10</p>
                        <p><strong>Release Date:</strong> ${movie.release_date}</p>
                        <p><strong>Genres:</strong> ${movie.genres.map(g => g.name).join(", ")}</p>
                        <p><strong>Overview:</strong> ${movie.overview}</p>

                        <div class="watch-button">
                            <button id="watchTrailer">Watch Trailer</button>
                            <button class="watchnow">Watch Now</button>
                            <button class="related-books">Related Books</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        movieDetails.style.display = "flex";

        document.getElementById("closePopup").addEventListener("click", () => {
            movieDetails.style.display = "none";
        });

        const trailer = movie.videos.results.find(v => v.type === "Trailer");
        if (trailer) {
            document.getElementById("watchTrailer").addEventListener("click", () => {
                window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
            });
        } else {
            document.getElementById("watchTrailer").style.display = "none";
        }

        const watchNowBtn = movieDetails.querySelector(".watchnow");
        if (watchNowBtn) {
            watchNowBtn.addEventListener("click", () => {
                window.location.href = `pages/watchnow.html?id=${movie.id}`;
            });
        }

        const relatedBooksBtn = movieDetails.querySelector(".related-books");
        if (relatedBooksBtn) {
            relatedBooksBtn.addEventListener("click", () => {
                window.location.href = `pages/books.html?title=${encodeURIComponent(movie.title)}`;
            });
        }
 
    } catch (err) {
        console.error("Error fetching movie details:", err);
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

// ---------------- Watchlist ----------------
function addToWatchlist(movie) {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.some(m => m.id === movie.id)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert(`${movie.title} added to watchlist!`);
      } else {
        alert("Already in watchlist.");
    }
}

// ---------------- Event Listeners ----------------
document.querySelectorAll('.category-button').forEach(button => {
    button.addEventListener('click', () => fetchMoviesByCategory(button.dataset.genre));
});
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) searchMovies(query);
});

// Initialize
loadHeroMovie();
fetchTrendingMovies();