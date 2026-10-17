const searchInput = document.getElementById("movie-input");
const movieName = document.querySelector(".card h3");
const movieSearchBtn = document.querySelector(".movie-search-btn");
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (searchInput.value.trim() == "") {
    alert("Please enter a movie title");
  } else {
    movieName.textContent = searchInput.value.trim();
  }
});
