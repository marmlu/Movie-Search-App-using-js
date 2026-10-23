const searchInput = document.getElementById("movie-input");
const movieSearchBtn = document.querySelector(".movie-search-btn");
const movieResult = document.querySelector(".cards");
const searchForm = document.getElementById("search-form");
const message = document.getElementById("message");
const clearHistory = document.querySelector(".clear-history");
const searchHistoryContainer = document.getElementById(
  "search-history-container",
);
const movieHistory = JSON.parse(localStorage.getItem("movieHistory")) || [];
displayMovieHistory();
const movieCache = new Map();

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const storedMovie = searchInput.value.trim().toLowerCase();
  if (movieSearchBtn.disabled === true) {
    return;
  }
  movieResult.innerHTML = "";
  if (searchInput.value.trim() === "") {
    message.textContent = "Please enter a movie title";
  } else {
    message.textContent = "Searching for movies...";
    movieSearchBtn.disabled = true;
    if (!movieCache.has(storedMovie)) {
      getMovieInfo(storedMovie);
    } else {
      fetchFromCache(storedMovie);
      message.textContent = "Loaded from cache!";
      movieSearchBtn.disabled = false;
    }
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
        posterMovie.addEventListener(
          "error",
          function () {
            posterMovie.src = "https://placehold.co/300x450?text=No+Poster";
          },
          { once: true },
        );
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
      movieCache.set(movieName, movie.Search);
      message.textContent = `Found ${movie.Search.length} movies.`;

      if (!movieHistory.includes(movieName.toLowerCase())) {
        movieHistory.push(movieName.toLowerCase());

        localStorage.setItem("movieHistory", JSON.stringify(movieHistory));
        displayMovieHistory();
      }
    } else {
      message.textContent = `Request failed. Status ${response.status}`;
    }
  } catch {
    message.textContent = "Network failure";
  } finally {
    movieSearchBtn.disabled = false;
  }
}
function displayMovieHistory() {
  searchHistoryContainer.innerHTML = "";
  movieHistory.forEach(function (movie) {
    const movieNameButton = document.createElement("button");
    movieNameButton.textContent = movie;
    movieNameButton.classList.add("movie-search-btn");
    searchHistoryContainer.appendChild(movieNameButton);
    movieNameButton.addEventListener("click", function () {
      searchInput.value = movie;
      if (movieCache.has(movie)) {
        fetchFromCache(movie);
      } else {
        getMovieInfo(movie);
      }
    });
  });
}
clearHistory.addEventListener("click", function () {
  movieHistory.length = 0;
  localStorage.removeItem("movieHistory");
  searchHistoryContainer.innerHTML = "";
});
function fetchFromCache(targetedMovie) {
  movieResult.innerHTML = "";
  if (movieCache.has(targetedMovie)) {
    const cachedMovies = movieCache.get(targetedMovie);
    cachedMovies.forEach(function (cachedMovie) {
      const cachedMovieName = document.createElement("h3");
      cachedMovieName.textContent = cachedMovie.Title;
      const cachedMovieYear = document.createElement("p");
      cachedMovieYear.textContent = cachedMovie.Year;
      const cachedMoviePoster = document.createElement("img");
      if (cachedMovie.Poster === "N/A") {
        cachedMoviePoster.src = "https://placehold.co/300x450?text=No+Poster";
      } else {
        cachedMoviePoster.src = cachedMovie.Poster;
      }
      const cachedMovieCard = document.createElement("div");
      cachedMovieCard.appendChild(cachedMoviePoster);
      cachedMovieCard.appendChild(cachedMovieName);
      cachedMovieCard.appendChild(cachedMovieYear);
      cachedMovieCard.classList.add("card");
      movieResult.appendChild(cachedMovieCard);
    });
  }
}
