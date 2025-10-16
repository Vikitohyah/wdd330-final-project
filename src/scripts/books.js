import { setupFooterAndHeader } from "./modules.js";
setupFooterAndHeader();

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieTitle = urlParams.get("title");

    const booksContainer = document.getElementById("books-container");

    if (!movieTitle) {
        booksContainer.innerHTML = "<p>No movie title provided.</p>";
        return;
    }

    async function fetchRelatedBooks(title) {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}+movie`);
            if (!response.ok) throw new Error("Failed to fetch books");
            const data = await response.json();

            if (!data.items || data.items.length === 0) {
                booksContainer.innerHTML = `<p>No books found related to <strong>${title}</strong>.</p>`;
                return;
            }

            booksContainer.innerHTML = data.items
                .slice(0, 10)
                .map(book => {
                    const volume = book.volumeInfo;
                    return `
                        <div class="book-card">
                            <img src="${volume.imageLinks?.thumbnail || 'images/placeholder-book.jpg'}" alt="${volume.title}" loading="lazy">
                            <h3>${volume.title}</h3>
                            <p>${volume.authors ? volume.authors.join(', ') : 'Unknown Author'}</p>
                            <a href="${volume.previewLink}" target="_blank">View on Google Books</a>
                        </div>
                    `;
                })
                .join("");
        } catch (error) {
            booksContainer.innerHTML = "<p>Error fetching related books. Please try again later.</p>";
            console.error(error);
        }
    }

    fetchRelatedBooks(movieTitle);
});
