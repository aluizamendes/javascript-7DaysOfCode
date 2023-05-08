import { getPopularMoviesAPI, getSearchedMovieAPI } from "./apiFunctions.js";

const movieList = document.getElementById("movieList");
const searchInput = document.getElementById("pesquisar");
const checkboxShowFavorites = document.getElementById("mostrarFavoritos");
const favoritedMovies =  JSON.parse(localStorage.getItem("favoritos")) || [];

function saveFavoritesToLocalStorage(movies) {
    localStorage.setItem("favoritos", JSON.stringify(movies));
}

function cleanMovieList() {
    movieList.innerHTML = "";
}

// "formatar" a visualização da data pra aparecer só o ano
function formatReleaseYear(date) {
    let year = date.split("-")[0];
    return year;
}

// mostra descrição
function showDescription(description) {
    return description == "" ? "Sinopse não disponível." : description;
}

function findMovieIndex(movies, movieName) {
    return movies.findIndex(movie => movie.title == movieName);
}

// implementa sistema de favoritar um filme, adiciona e remove filmes do local storage
function favoriteMovieAction(arrMovies) {
    const btnFavoritar = document.querySelectorAll("#btnFavoritar");
        
    btnFavoritar.forEach((btn) => {
        btn.addEventListener("click", (event) => {

            // define variáveis dos itens
            const buttonEl = event.target.id == "btnFavoritar" ? event.target : event.target.parentElement;
            const heartIcon = btn.querySelector("img");            
            const favoritarText = heartIcon.nextElementSibling;
            let movieNameText = buttonEl.closest('.movie_infoBox').firstElementChild.textContent;

            const favoriteState = {
                favorited: "assets/heart-fill-icon.svg",
                notFavorited: "assets/heart-icon.svg"
            }

            // array da string do nome e retirar o ano (ultimo elemento)
            let movieNameSplit = movieNameText.split(" ");
            movieNameSplit.pop();
            movieNameText = movieNameSplit.join(" ");

            // corresponde ao index do filme clicado
            const index = findMovieIndex(arrMovies, movieNameText); 
            const movieSelected = arrMovies[index];

            // checa se o filme esta na lista dos favoritos
            const isFavorite = checkMovieIsFavorite(movieSelected.id);           

            // se estiver nos favoritos remove, se não, adiciona
            if (isFavorite) {

                // definir a div do filme correspondente atraves do id
                const movieItem = document.querySelector(`[data-id="${movieSelected.id}"]`);

                heartIcon.src = favoriteState.notFavorited;
                favoritarText.textContent = "Favoritar";

                // se usuário estiver na lista de favoritos, remove div do filme
                const isShowingFavorites = checkboxShowFavorites.checked;
                if (isShowingFavorites) movieItem.remove();

                // achar o index dentro da lista de favoritos correspondente ao titulo do filme
                const indexMovieRemove = findMovieIndex(favoritedMovies, movieNameText); 
                
                // deleta do array e do local storage
                favoritedMovies.splice(indexMovieRemove, 1);
                saveFavoritesToLocalStorage(favoritedMovies);

            } else {
                heartIcon.src = favoriteState.favorited;
                favoritarText.textContent = "Desfavoritar";
    
                // adiciona o filme correspondente na lista de favoritos
                favoritedMovies.push(movieSelected);
                saveFavoritesToLocalStorage(favoritedMovies);
            }
        })
    });
}

function checkMovieIsFavorite(id) {
    return favoritedMovies.find(movie => movie.id === id);
}

function renderMovies(movie) {
    const imagePath = "https://image.tmdb.org/t/p/w500/";
    const posterPath = movie.poster_path == null ? "assets/poster-not-found.png" : imagePath + movie.poster_path;
    const isFavorite = checkMovieIsFavorite(movie.id);

    const movieData = {
        movieID: movie.id,
        moviePoster: posterPath,
        movieTitle: movie.title,
        movieYear: formatReleaseYear(movie.release_date),
        movieRating: movie.vote_average.toFixed(1),
        movieDescription: showDescription(movie.overview),
        heartIconState: isFavorite ? "assets/heart-fill-icon.svg" : "assets/heart-icon.svg",
        favoriteText: isFavorite ? "Desfavoritar" : "Favoritar"
    }

    movieList.innerHTML +=  `
    <div class="movie_item" data-id="${movieData.movieID}">
        <div class="movie_image">
            <img src="${movieData.moviePoster}" alt="Poster do filme ${movieData.movieTitle}">
        </div>
        <div class="movie_infoBox">
            <p class="movie_title">${movieData.movieTitle} (${movieData.movieYear})</p>
            <div class="movie_actions">
                <div class="movie_actionBox">
                    <img src="assets/star-icon.svg">
                    <span id="movieRating">${movieData.movieRating}</span>
                </div>
                <div class="movie_actionBox" >
                    <button id="btnFavoritar" class="btn-favoritar">                        
                        <img id="heartIcon" src="${movieData.heartIconState}">
                        <span>${movieData.favoriteText}</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="movie_description">
            <p>${movieData.movieDescription}</p>
        </div>
    </div>
    `
}

function updateMovieList(movies) {
    movies.forEach(movie => renderMovies(movie));        
    favoriteMovieAction(movies);
}

async function showSearchedMovies() {
    const searchedMovies = await getSearchedMovieAPI(searchInput.value);
    cleanMovieList();
    updateMovieList(searchedMovies);  
}

function showPopularMovies() {  
    const movies = JSON.parse(localStorage.getItem("popularMovies"));
    updateMovieList(movies);
 }

function handleShowFavoriteMovies(event) {
    const isChecked = event.target.checked;

    if (isChecked) { 
        cleanMovieList();  
        updateMovieList(favoritedMovies);        

    } else {
        cleanMovieList();
        showPopularMovies();
    }
}

// pesquisar e exibir filmes
searchInput.addEventListener("keyup", async (event) => { 

    if (event.key == "Enter") {        
        await showSearchedMovies();

        if (searchInput.value == "") {
            cleanMovieList();
            showPopularMovies();
        }

        checkboxShowFavorites.checked = false;
    } 
})

checkboxShowFavorites.addEventListener("click", handleShowFavoriteMovies);

window.addEventListener("load", async () => {

    // consume a api quando a janela é carregada
    const popularMovies = await getPopularMoviesAPI();

    // salva a lista de filmes da resposta da api no cache e mostra na tela
    // não precisar fazer uma requisição toda vez que quiser exibir os filmes populares
    localStorage.setItem("popularMovies", JSON.stringify(popularMovies));
    console.log("Filmes populares atualizados.");
    showPopularMovies();
});