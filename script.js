const searchInput = document.getElementById("movie-input");
const movieName = document.querySelector(".card h3");
const movieSearchBtn = document.querySelector(".movie-search-btn");
const searchForm = document.getElementById("search-form");
const moviePoster = document.querySelector(".card img");
const movieYear = document.querySelector(".card-info p");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (searchInput.value.trim() === "") {
    alert("Please enter a movie title");
  } else {
    const storedMove = searchInput.value.trim();
    movieName.textContent = searchInput.value.trim();
    getMovieInfo(storedMove);
  }
});
async function getMovieInfo(movieName) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=f61e9a1c&s=${encodeURIComponent(movieName)}`,
    );
    if (response.ok) {
      const movie = await response.json();
      if (movie.Response === "False") {
        alert(movie.Error);
        return;
      }
      if (movie.Search[0].Poster === "N/A") {
        moviePoster.src = "https://placehold.co/300x450?text=No+Poster";
      } else {
        moviePoster.src = movie.Search[0].Poster;
      }
      movieYear.textContent = `Year: ${movie.Search[0].Year}`;
    } else {
      alert(`Request failed. Status: ${response.status}`);
    }
  } catch {
    alert("Network failure");
  }
}
