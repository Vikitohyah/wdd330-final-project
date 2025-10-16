import { setupFooterAndHeader } from "./modules.js";
setupFooterAndHeader();

const API_KEY = "ddf69887bef48b884e9d1c8c4b9556e8";
const BASE_URL = "https://api.themoviedb.org/3";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

const userRegion = Intl.DateTimeFormat().resolvedOptions().locale.split("-")[1] || "US";

const movieContainer = document.getElementById("movie-container");
const sourcesContainer = document.getElementById("sources-container");

// ---------- Fetch movie details ----------
async function fetchMovieDetails(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return await res.json();
}

// ---------- Fetch watch providers (Streaming Platforms)----------
async function fetchWatchProviders(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch watch providers");
  return await res.json();
}

// ---------- Render movie info ----------
function renderMovieDetails(movie) {
  movieContainer.innerHTML = `
    <div class="movie-details">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      <div class="movie-info">
        <h2>${movie.title}</h2>
        <p><strong>Release:</strong> ${movie.release_date}</p>
        <p>${movie.overview}</p>
      </div>
    </div>
  `;
}

// ---------- Render streaming platforms (Depending on users country) ----------
function renderStreamingProviders(data) {
  const region = data.results[userRegion] || data.results["US"];
  sourcesContainer.innerHTML = "";

  if (!region || (!region.flatrate && !region.rent && !region.buy)) {
    sourcesContainer.innerHTML = `<p>No streaming options available in your region.</p>`;
    return;
  }

  const providerList = [
    ...(region.flatrate || []),
    ...(region.rent || []),
    ...(region.buy || [])
  ];

  const link = region.link;

  providerList.slice(0, 4).forEach(provider => {
    const logoUrl = `https://image.tmdb.org/t/p/original${provider.logo_path}`;
    const providerCard = document.createElement("div");
    providerCard.className = "source-card";
    providerCard.innerHTML = `
      <a href="${link}" target="_blank" class="stream-link">
        <img src="${logoUrl}" alt="${provider.provider_name}" class="source-logo">
        <p>${provider.provider_name}</p>
      </a>
    `;
    sourcesContainer.appendChild(providerCard);
  });
}

// ---------- Initialize ----------
async function init() {
  if (!movieId) {
    movieContainer.innerHTML = "<p>Movie ID missing.</p>";
    return;
  }

  try {
    const [movie, providers] = await Promise.all([
      fetchMovieDetails(movieId),
      fetchWatchProviders(movieId)
    ]);
    renderMovieDetails(movie);
    renderStreamingProviders(providers);
  } catch (err) {
    console.error(err);
    sourcesContainer.innerHTML = "<p>Failed to load streaming information.</p>";
  }
}

init();