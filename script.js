const searchInput = document.getElementById("movie-input");
const movieName = document.querySelector(".card h3");
const movieSearchBtn = document.querySelector(".movie-search-btn");
const movieResult = document.querySelector(".cards");
const searchForm = document.getElementById("search-form");
const message = document.getElementById("message");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const storedMovie = searchInput.value.trim();

  if (searchInput.value.trim() === "") {
    message.textContent = "Please enter a movie title";
  } else {
    message.textContent = "Searching for movies...";
    movieSearchBtn.disabled = true;
    getMovieInfo(storedMovie);
  }
});
async function getMovieInfo(movieName) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=f61e9a1c&s=${encodeURIComponent(movieName)}`,
    );
    if (response.ok) {
      const movie = await response.json();
      movieResult.innerHTML = "";
      if (movie.Response === "False") {
        message.textContent = movie.Error;
        return;
      }
      for (let i = 0; i < movie.Search.length; i++) {
        const cardContainer = document.createElement("article");
        const posterMovie = document.createElement("img");
        const nameMovie = document.createElement("h3");
        const yearMovie = document.createElement("p");

        nameMovie.textContent = movie.Search[i].Title;

        if (movie.Search[i].Poster === "N/A") {
          posterMovie.src = "https://placehold.co/300x450?text=No+Poster";
        } else {
          posterMovie.src = movie.Search[i].Poster;
        }
        yearMovie.textContent = `Year: ${movie.Search[i].Year}`;
        nameMovie.classList.add("card-info");
        yearMovie.classList.add("card-info");
        cardContainer.classList.add("card");
        cardContainer.appendChild(posterMovie);
        cardContainer.appendChild(nameMovie);
        cardContainer.appendChild(yearMovie);

        movieResult.appendChild(cardContainer);
      }
      message.textContent = `Found ${movie.Search.length} movies.`;
    } else {
      message.textContent = `Request failed. Status: ${response.status}`;
    }
  } catch {
    message.textContent = "Network failure";
  } finally {
    movieSearchBtn.disabled = false;
  }
}
