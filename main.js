import { apiKey } from "./apiKey.js";

const movieList = document.getElementById("movieList");
const inputPesquisar = document.getElementById("pesquisar");
const checkboxMostrarFavoritos = document.getElementById("mostrarFavoritos");
const favoritedMovies =  JSON.parse(localStorage.getItem("favoritos")) || [];

async function getPopularMoviesAPI() {
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;
    
    try {
        let request =  await fetch(url);

        // desestruturação de array
        let { results } = await request.json();
        return results;
    }

    catch(error) {
        console.log(error);
    }
} 

async function getSearchedMovieAPI(movieName) {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${movieName}&page=1&include_adult=false`;

    try {
        let request = await fetch(url);
        let { results } = await request.json();
        return results;
    }

    catch(error) {
        console.error(`Erro ao carregar recursos: ${error}`);
    }
}

// "formatar" a visualização da data pra aparecer só o ano
function formatReleaseYear(date) {
    let year = date.split("-")[0];
    return year;
}

function showDescription(description) {
    return description == "" ? "Sinopse não disponível." : description;
}

// implementa sistema de favoritar um filme
// adiciona e remove filmes do local storage
function favoriteMovieAction(arrMovies) {
    const btnFavoritar = document.querySelectorAll("#btnFavoritar");
        
    btnFavoritar.forEach((btn) => {
        btn.addEventListener("click", (event) => {

            let buttonEl = event.target.id == "btnFavoritar" ? event.target : event.target.parentElement;
            let heartIcon = btn.querySelector("img");            
            let favoritarText = heartIcon.nextElementSibling;
            let movieNameText = buttonEl.closest('.movie_infoBox').firstElementChild.textContent;

            // array da string do nome e retirar o ano (ultimo elemento)
            let movieNameSplit = movieNameText.split(" ");
            movieNameSplit.pop();
            movieNameText = movieNameSplit.join(" ");

            // corresponde ao index do filme clicado
            let index = arrMovies.findIndex((movie) => movie.title == movieNameText);
            let movieSelected = arrMovies[index];

            // checar os favoritos
            // se o clicado ja estiver nos favoritos não add a lista e desfavorita
            let isFavorite = checkMovieIsFavorite(movieSelected.id);

            if (isFavorite) {
                const movieItem = document.querySelector(`[data-id="${movieSelected.id}"]`);

                heartIcon.src = "assets/heart-icon.svg";
                favoritarText.textContent = "Favoritar";

                // achar o index dentro da lista de favoritos correspondente ao titulo do filme
                let indexMovieRemove = favoritedMovies.findIndex(movie => movie.title == movieSelected.title); 
                
                // se estiver mostrando a lista de favoritos, remove div do filme na hora
                const isShowingFavorites = checkboxMostrarFavoritos.checked;
                if (isShowingFavorites) movieItem.remove();

                // deleta do array e do local storage
                favoritedMovies.splice(indexMovieRemove, 1);
                localStorage.setItem("favoritos", JSON.stringify(favoritedMovies));

            } else {
                heartIcon.src = "assets/heart-fill-icon.svg";
                favoritarText.textContent = "Desfavoritar";
    
                // adiciona o filme correspondente na lista de favoritos
                favoritedMovies.push(movieSelected);
                localStorage.setItem("favoritos", JSON.stringify(favoritedMovies));
            }
        })
    });
}

async function showSearchedMovies() {
    let searchedMovies = await getSearchedMovieAPI(inputPesquisar.value);

    movieList.innerHTML = "";
    searchedMovies.forEach(movie => renderMovies(movie));    

    favoriteMovieAction(searchedMovies);    
}

async function showPopularMovies() {    
    const movies = await getPopularMoviesAPI();
    movies.forEach(movie => renderMovies(movie));

    //console.log(movies)
    favoriteMovieAction(movies);
}

function checkMovieIsFavorite(id) {
    return favoritedMovies.find(movie => movie.id === id);
}

function renderMovies(movie) {
    let imagePath = "https://image.tmdb.org/t/p/w500/";
    let posterPath = movie.poster_path == null ? "assets/poster-not-found.png" : imagePath + movie.poster_path;
    let isFavorite = checkMovieIsFavorite(movie.id);
    let movieItemId = movie.id;

    movieList.innerHTML +=  `
    <div class="movie_item" data-id="${movieItemId}">
        <div class="movie_image">
            <img src="${posterPath}" alt="Poster do filme ${movie.title}">
        </div>
        <div class="movie_infoBox">
            <p class="movie_title">${movie.title} (${ formatReleaseYear(movie.release_date) })</p>
            <div class="movie_actions">
                <div class="movie_actionBox">
                    <img src="assets/star-icon.svg">
                    <span id="movieRating">${movie.vote_average}</span>
                </div>
                <div class="movie_actionBox" >
                    <button id="btnFavoritar">                        
                        <img id="heartIcon" src="${isFavorite ? "assets/heart-fill-icon.svg" : "assets/heart-icon.svg"}">
                        <span>${isFavorite ? "Desfavoritar" : "Favoritar"}</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="movie_description">
            <p>${ showDescription(movie.overview) }</p>
        </div>
    </div>
    `
}

function handleShowFavoriteMovies(event) {
    const isChecked = event.target.checked;

    if (isChecked) {        
        movieList.innerHTML = "";
        favoritedMovies.forEach(movie => renderMovies(movie));
        
        favoriteMovieAction(favoritedMovies);

    } else {
        movieList.innerHTML = "";
        showPopularMovies();
    }
}

// consume a api toda vez que a janela é carregada
window.addEventListener("load", async () => {
    await showPopularMovies();
});

// pesquisar e exibir filme
// se o  input estiver vazio e o user der `enter` ou `focusout` volta a mostrar os filmes populares
inputPesquisar.addEventListener("keyup", async (evt) => { 

    if (evt.key == "Enter") {        
        await showSearchedMovies();

        if (inputPesquisar.value == "") {
            movieList.innerHTML = "";
            await showPopularMovies();
        }

        checkboxMostrarFavoritos.checked = false;
    } 
})

inputPesquisar.addEventListener("focusout", async () => {
    
    if (inputPesquisar.value == "") {
        movieList.innerHTML = "";
        await showPopularMovies();  
    }
})

checkboxMostrarFavoritos.addEventListener("click", handleShowFavoriteMovies);